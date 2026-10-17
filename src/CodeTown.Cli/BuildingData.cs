namespace CodeTown.Cli;

public sealed record BuildingData(string Name, string FilePath, int LineCount, int MethodCount, int MaxMethodComplexity);