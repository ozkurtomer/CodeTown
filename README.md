# CodeTown

**Kodunu şehre dönüştür.**

CodeTown, C# sınıflarını etkileşimli bir 3D şehirde keşfetmeni sağlar. Her sınıf bir binaya dönüşür: binanın yüksekliği sınıfın satır sayısını, rengi ise en karmaşık metodunun yaklaşık karmaşıklığını gösterir. Böylece kod tabanındaki yoğun ve karmaşık bölgeleri yalnızca okumak yerine görerek keşfedebilirsin.

Proje iki parçadan oluşur:

- **CodeTown.Cli** — C# dosyalarını Roslyn ile tarar, sınıf ölçümlerini JSON olarak üretir.
- **Web uygulaması** — React ve Three.js ile bu verileri tarayıcıda gezilebilir bir 3D şehir olarak sunar.

## Özellikler

- Tek bir C# dosyasını veya bir klasördeki C# dosyalarını tara.
- Sınıf adını, satır sayısını, metot sayısını ve en yüksek metot karmaşıklığını çıkar.
- Şehri sürükleyerek döndür, tekerlekle yakınlaştır ve binaları seç.
- Seçilen sınıfın ölçümlerini ve kaynak dosya yolunu incele.
- Karmaşıklık renkleriyle daha yakından incelenebilecek sınıfları hızlıca fark et.

## Hızlı başlangıç

### Gereksinimler

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js ve npm](https://nodejs.org/)

### Web uygulamasını çalıştır

Depo kök dizininde:

```bash
cd web
npm ci
npm run dev
```

Terminalde gösterilen yerel adresi tarayıcıda aç. Arayüz, şehir verisini `web/public/city.json` dosyasından yükler; depodaki örnek veriyle tarayıcıyı hemen açabilirsin.

### Kendi C# kodunu görselleştir

Yeni bir terminalde depo kök dizinine dönüp CLI'ı çalıştır. Örneğin depodaki örnek C# projesini tara:

```bash
dotnet run --project src/CodeTown.Cli/CodeTown.Cli.csproj -- src/CodeTown.Cli web/public/city.json
```

Kendi projen için `src/CodeTown.Cli` yerine taramak istediğin dosya veya klasörün yolunu ver:

```bash
dotnet run --project src/CodeTown.Cli/CodeTown.Cli.csproj -- "C:/Projects/MyApp" web/public/city.json
```

Son bağımsız değişken çıktı dosyasının yoludur. Atlanırsa sonuç, komutun çalıştırıldığı dizinde `city.json` adıyla oluşturulur. Web uygulamasının göstereceği veriyi güncellemek için çıktı yolunu `web/public/city.json` olarak ver; JSON üretildikten sonra tarayıcıyı yenile.

Klasör taramasında `bin`, `obj`, `.git` ve `node_modules` dizinleri atlanır. Tek bir dosya verirsen yalnızca o dosya taranır.

## Ölçümler nasıl okunur?

- **Yükseklik:** Sınıfın kaynak dosyadaki satır aralığı.
- **Metot sayısı:** Sınıfa doğrudan tanımlanmış metotların sayısı.
- **Renk:** Sınıftaki en yüksek metot karmaşıklığı.
  - **Yeşil (1–5):** düşük
  - **Sarı (6–10):** orta
  - **Kırmızı (11+):** yüksek
  - **Gri (0):** ölçülebilir metot yok

Karmaşıklık değeri, 1 başlangıç değerine karar noktalarının eklenmesiyle hesaplanır. `if`, döngüler, `catch`, koşullu ifadeler, switch dalları ve `&&`, `||`, `??` gibi operatörler bu değeri artırır. Bu, kodu incelemeye yardımcı olan yaklaşık bir ölçümdür; tek başına kod kalitesinin göstergesi değildir.

## Geliştirme

Web uygulamasını depo kök dizininden derle ve lint kontrolünü çalıştır:

```bash
cd web
npm run build
npm run lint
```

.NET çözümünü depo kök dizininden derle:

```bash
dotnet build CodeTown.sln
```

## Proje yapısı

```text
CodeTown/
├── src/CodeTown.Cli/       # C# analiz aracı ve JSON üretimi
├── web/                    # React + TypeScript 3D arayüzü
│   └── public/city.json    # Arayüzün kullandığı şehir verisi
├── city.json               # CLI'ın varsayılan çıktı adı
└── CodeTown.sln            # .NET çözümü
```

## Teknolojiler

- **Analiz:** C#, .NET 9, [Roslyn](https://github.com/dotnet/roslyn)
- **Arayüz:** React, TypeScript, Vite
- **3D şehir:** Three.js, React Three Fiber, Drei
