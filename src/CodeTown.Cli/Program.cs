using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Text.Json;

namespace CodeTown.Cli;

internal static class Program
{
    private static void Main(string[] args)
    {
        if (args.Length < 1 || args.Length > 2)
        {
            Console.WriteLine(
                "Kullanım: CodeTown <dosya-veya-klasör-yolu> [çıktı-yolu]");

            Environment.ExitCode = 1;
            return;
        }

        string inputPath = Path.GetFullPath(args[0]);
        List<string> files;

        if (File.Exists(inputPath))
        {
            files = new List<string> { inputPath };
        }
        else if (Directory.Exists(inputPath))
        {
            var ignoredFolders = new HashSet<string>(
                StringComparer.OrdinalIgnoreCase)
            {
                "bin",
                "obj",
                ".git",
                "node_modules"
            };

            files = Directory
                .EnumerateFiles(inputPath, "*.cs", SearchOption.AllDirectories)
                .Where(file =>
                {
                    string relativePath = Path.GetRelativePath(inputPath, file);

                    string[] segments = relativePath.Split(
                        Path.DirectorySeparatorChar,
                        Path.AltDirectorySeparatorChar);

                    return !segments.Any(segment =>
                        ignoredFolders.Contains(segment));
                })
                .OrderBy(file => file, StringComparer.Ordinal)
                .ToList();
        }
        else
        {
            Console.WriteLine($"Dosya veya klasör bulunamadı: {inputPath}");
            Environment.ExitCode = 1;
            return;
        }

        Console.WriteLine("CodeTown — Şehir taraması");
        Console.WriteLine($"Taranacak dosya: {files.Count}");
        Console.WriteLine();

        var buildings = new List<BuildingData>();

        foreach (string filePath in files)
        {
            string source = File.ReadAllText(filePath);

            var tree = CSharpSyntaxTree.ParseText(source, path: filePath);
            var root = tree.GetCompilationUnitRoot();

            var classes = root.DescendantNodes()
                .OfType<ClassDeclarationSyntax>()
                .ToList();

            foreach (var classNode in classes)
            {
                var methods = classNode.Members.OfType<MethodDeclarationSyntax>().ToList();

                int methodCount = methods.Count;

                int maxMethodComplexity = methods.Select(method => ComplexityAnalyzer.Calculate(method)).DefaultIfEmpty(0).Max();

                var lineSpan = classNode.GetLocation().GetLineSpan();

                int startLine = lineSpan.StartLinePosition.Line;
                int endLine = lineSpan.EndLinePosition.Line;
                int lineCount = endLine - startLine + 1;

                var building = new BuildingData(Name: classNode.Identifier.ValueText, FilePath: filePath, LineCount: lineCount, MethodCount: methodCount, MaxMethodComplexity: maxMethodComplexity);

                buildings.Add(building);

                Console.WriteLine(
                    $"Bina: {building.Name} | " +
                    $"Satır: {building.LineCount} | " +
                    $"Metot: {building.MethodCount}");
            }
        }

        var city = new
        {
            schemaVersion = 1,
            buildings
        };

        var jsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        string json = JsonSerializer.Serialize(city, jsonOptions);

        string outputPath = Path.GetFullPath(
            args.Length == 2 ? args[1] : "city.json");

        string? outputDirectory = Path.GetDirectoryName(outputPath);

        if (outputDirectory is not null)
        {
            Directory.CreateDirectory(outputDirectory);
        }

        File.WriteAllText(outputPath, json);

        Console.WriteLine();
        Console.WriteLine($"Şehir oluşturuldu: {buildings.Count} bina");
        Console.WriteLine($"Veri dosyası: {outputPath}");
    }
}