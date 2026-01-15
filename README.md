# IT Trends Dashboard / Sektörel Trend Analizi 🚀

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**[English Below⬇️]**

## 🇹🇷 Proje Hakkında
Bu proje, yazılım dünyasındaki popüler teknolojilerin (Diller, Framework'ler, Araçlar) yıllara göre değişimini ve bölgesel dağılımını analiz eden modern bir **Dashboard** uygulamasıdır. 

**Amaç:** Geliştiricilerin ve yöneticilerin piyasa trendlerini (Global ve Türkiye özelinde) takip etmesini kolaylaştırmak.

### ✨ Özellikler
*   **🌍 Bölgesel Analiz Modu**: **Global** ve **Türkiye** verileri arasında geçiş yapabilirsiniz. Türkiye modunda yerel pazar dinamikleri (.NET, Java, Angular vb. ağırlığı) simüle edilmiştir.
*   **🗣️ Çoklu Dil Desteği (i18n)**: Tek tıkla **Türkçe (TR)** ve **İngilizce (EN)** arayüz arasında geçiş.
*   **📊 Zengin Görselleştirme**: 
    *   **Zaman Serisi**: 2022-2026 arası büyüme trendleri.
    *   **Pazar Payı**: "İlk 10 Yetenek" grafiği ve yüzdelik dilimler.
*   **📱 Mobil Uyumlu**: Tamamen responsive tasarım (Mobil Sidebar, optimize edilmiş grafikler).
*   **📂 Kategori Filtreleme**: Frontend, Backend, DevOps, Mobil, Veri Bilimi gibi mesleki kırılımlar.

### 🛠️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için:

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

2.  **Uygulamayı Başlatın:**
    ```bash
    npm run dev
    ```

3.  **Verileri Güncelleme (Opsiyonel):**
    Trend verileri `scripts/generate_data.js` scripti ile üretilir. Yeni veri seti oluşturmak için:
    ```bash
    node scripts/generate_data.js
    ```

---

## 🇬🇧 About the Project
This project is a modern **Dashboard** application that analyzes the evolution and regional distribution of popular technologies (Languages, Frameworks, Tools) in the software world.

**Goal:** To help developers and managers track market trends (Global and Turkey specifics) easily.

### ✨ Features
*   **🌍 Regional Analysis Mode**: Switch between **Global** and **Turkey** data. Turkey mode simulates local market dynamics (higher emphasis on .NET, Java, Angular etc.).
*   **🗣️ Multi-Language Support (i18n)**: Toggle between **Turkish (TR)** and **English (EN)** interfaces instantly.
*   **📊 Rich Visualization**: 
    *   **Time Series**: Growth trends from 2022 to 2026.
    *   **Market Share**: "Top 10 Skills" chart with percentage indicators.
*   **📱 Mobile Responsive**: Fully responsive design (Mobile Drawer, optimized charts).
*   **📂 Category Filtering**: Profession-based breakdowns like Frontend, Backend, DevOps, Mobile, Data Science.

### 🛠️ Installation & Setup

To run the project locally:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start Application:**
    ```bash
    npm run dev
    ```

3.  **Regenerate Data (Optional):**
    Trend data is generated via `scripts/generate_data.js`. To generate a fresh dataset:
    ```bash
    node scripts/generate_data.js
    ```

---

### 🏗️ Tech Stack
*   **Frontend**: React, Vite
*   **Styling**: Tailwind CSS
*   **Charts**: Recharts
*   **Icons**: Lucide React
*   **Data Generation**: Node.js Script
