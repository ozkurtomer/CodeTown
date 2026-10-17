# CodeTown

[English](#english) · [Türkçe](#türkçe)

---

## English

**Turn your code into a city.**

CodeTown lets you explore C# classes as an interactive 3D city. Each class becomes a building: its height shows the number of lines, and its color shows the approximate complexity of its most complex method. Instead of only reading dense or complicated parts of a codebase, you can see where they are.

### Features

- Scan a single C# file or all C# files in a folder
- Extract class name, line count, method count, and highest method complexity
- Rotate and zoom the city, click buildings to inspect them
- View a selected class's metrics and source file path

### Reading the city

| Element | Meaning |
|---|---|
| Height | Line range of the class in its source file |
| Method count | Number of methods defined directly in the class |
| 🟢 Green | Highest method complexity 1–5 (low) |
| 🟡 Yellow | 6–10 (medium) |
| 🔴 Red | 11 and above (high) |
| ⚪ Grey | No measurable methods |

Complexity starts at 1 and increases with decision points such as `if`, loops, `catch`, conditional expressions, switch branches, and operators like `&&`, `||`, and `??`. It is an approximate metric and not a measure of overall code quality on its own.

### Quick start

**Requirements:** [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) and [Node.js](https://nodejs.org/)

**1. Run the web app** (uses the included sample data)

```bash
cd web
npm ci
npm run dev
```

Open the local address shown in the terminal.

**2. Visualize your own code** (run from the repository root)

```bash
dotnet run --project src/CodeTown.Cli/CodeTown.Cli.csproj -- "C:/Projects/MyApp" web/public/city.json
```

The first argument is the file or folder to scan, and the second is the output JSON path. Write the output to `web/public/city.json` and refresh the browser to see your project. When scanning a folder, `bin`, `obj`, `.git`, and `node_modules` are skipped.

### Project structure

```
CodeTown/
├── src/CodeTown.Cli/   # Roslyn-based analyzer that produces JSON
├── web/                # React + TypeScript + Three.js front end
│   └── public/city.json
└── CodeTown.sln
```

### Tech stack

- **Analysis:** C#, .NET 9, Roslyn
- **Front end:** React, TypeScript, Vite
- **3D:** Three.js, React Three Fiber, Drei

### Development

```bash
cd web && npm run build && npm run lint
dotnet build CodeTown.sln
```

### Contributing

Ideas, bug reports, and pull requests are welcome. For larger changes, please open an issue first.

### License

[MIT](LICENSE)

---

## Türkçe

**Kodunu şehre dönüştür.**

CodeTown, C# sınıflarını etkileşimli bir 3D şehirde keşfetmeni sağlar. Her sınıf bir binaya dönüşür: yükseklik sınıfın satır sayısını, renk ise en karmaşık metodunun yaklaşık karmaşıklığını gösterir. Kod tabanındaki yoğun ve karmaşık bölgeleri yalnızca okumak yerine görerek bulabilirsin.

### Özellikler

- Tek bir C# dosyasını ya da bir klasördeki tüm C# dosyalarını tara
- Sınıf adı, satır sayısı, metot sayısı ve en yüksek metot karmaşıklığını çıkar
- Şehri döndür, yakınlaştır ve binalara tıklayarak incele
- Seçilen sınıfın ölçümlerini ve kaynak dosya yolunu gör

### Şehir nasıl okunur?

| Öğe | Anlamı |
|---|---|
| Yükseklik | Sınıfın kaynak dosyadaki satır aralığı |
| Metot sayısı | Sınıfa doğrudan tanımlanmış metot sayısı |
| 🟢 Yeşil | En yüksek karmaşıklık 1–5 (düşük) |
| 🟡 Sarı | 6–10 (orta) |
| 🔴 Kırmızı | 11 ve üzeri (yüksek) |
| ⚪ Gri | Ölçülebilir metot yok |

Karmaşıklık 1 başlangıç değeriyle hesaplanır ve `if`, döngüler, `catch`, koşullu ifadeler, switch dalları ile `&&`, `||`, `??` gibi operatörlerle artar. Bu yaklaşık bir ölçümdür; tek başına kod kalitesinin göstergesi değildir.

### Hızlı başlangıç

**Gereksinimler:** [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) ve [Node.js](https://nodejs.org/)

**1. Web uygulamasını çalıştır** (depodaki örnek veriyle açılır)

```bash
cd web
npm ci
npm run dev
```

Terminalde görünen yerel adresi tarayıcıda aç.

**2. Kendi kodunu görselleştir** (depo kök dizininden)

```bash
dotnet run --project src/CodeTown.Cli/CodeTown.Cli.csproj -- "C:/Projects/MyApp" web/public/city.json
```

İlk argüman taranacak dosya ya da klasör, ikincisi çıktı JSON dosyasının yolu. Çıktıyı `web/public/city.json` olarak verirsen tarayıcıyı yenilediğinde kendi projenin şehrini görürsün. Klasör taramasında `bin`, `obj`, `.git` ve `node_modules` dizinleri atlanır.

### Proje yapısı

```
CodeTown/
├── src/CodeTown.Cli/   # Roslyn ile analiz, JSON üretimi
├── web/                # React + TypeScript + Three.js arayüzü
│   └── public/city.json
└── CodeTown.sln
```

### Teknolojiler

- **Analiz:** C#, .NET 9, Roslyn
- **Arayüz:** React, TypeScript, Vite
- **3D:** Three.js, React Three Fiber, Drei

### Geliştirme

```bash
cd web && npm run build && npm run lint
dotnet build CodeTown.sln
```

### Katkı

Fikir, hata bildirimi ve pull request'lere açığım. Büyük bir değişiklikten önce lütfen bir issue aç.

### Lisans

[MIT](LICENSE)
