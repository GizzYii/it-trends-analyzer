import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '../src/data/trends.json');

// Restore Profession-Based Categories + New Additions
const CATEGORIES = {
    "Frontend": [
        "React", "Vue.js", "Angular", "Svelte", "Next.js", "Tailwind CSS", "HTML/CSS", "TypeScript"
    ],
    "Backend": [
        "Node.js", "Python", "Java", "C#", "Go", "PHP", "Ruby", "Spring Boot", ".NET Core", "Django", "FastAPI", "NestJS"
    ],
    "Mobile": [
        "Flutter", "React Native", "Swift", "Kotlin", "Android", "iOS", "Dart", "Objective-C"
    ],
    "DevOps": [
        "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "Linux"
    ],
    "Data": [
        "Python", "SQL", "Pandas", "TensorFlow", "PyTorch", "Spark", "Hadoop", "PowerBI", "Tableau", "R", "OpenAI API"
    ],
    "Test": [
        "Selenium", "Cypress", "Playwright", "Jest", "JUnit", "Appium"
    ],
    "Database": [
        "PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch", "Cassandra", "SQLite"
    ],
    "Tools": [
        "VS Code", "IntelliJ IDEA", "Git", "Jira", "Visual Studio", "Postman", "Figma"
    ],
    "OS": [
        "Windows", "MacOS", "Ubuntu", "CentOS", "Red Hat"
    ]
};

// Bias factors for Turkey region (multiplier)
const TR_BIAS = {
    // Languages & Frameworks
    "Java": 1.4, "Spring Boot": 1.5,
    "C#": 1.5, ".NET Core": 1.6,
    "PHP": 1.3, "Laravel": 1.3, // Laravel often goes with PHP
    "Angular": 1.4,
    "React": 0.95, // Global standard, but slightly less dominant vs .NET in enterprsies
    "Vue.js": 1.1,
    "Flutter": 1.3,
    "Android": 1.2,

    // Databases
    "MySQL": 1.3, "PostgreSQL": 1.2, "MSSQL": 1.5, // MSSQL maps to SQL/C# ecosystem

    // DevOps / Cloud
    "Azure": 1.3, "AWS": 0.9,
    "Windows": 1.4, // Enterprise OS

    // Tools
    "Visual Studio": 1.5, "Jira": 1.2
};

function generateData() {
    console.log("Generating data...");

    const data = [];
    let idCounter = 1;
    const years = [2022, 2023, 2024, 2025, 2026];
    const regions = ["Global", "TR"];

    regions.forEach(region => {
        years.forEach(year => {
            Object.entries(CATEGORIES).forEach(([category, skills]) => {
                skills.forEach(skill => {
                    // Base random count
                    let baseMin = 20;
                    let baseMax = 100;

                    // Popular techs get higher base
                    if (["JavaScript", "Python", "Java", "SQL", "React", "AWS", "Docker", "Node.js", "TypeScript"].includes(skill)) {
                        baseMin = 70; baseMax = 220;
                    }

                    const baseCount = Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin;

                    // Growth logic
                    let growthFactor = 1.0;
                    const yearDiff = year - 2022;

                    // High Growth
                    if (["Python", "TypeScript", "Go", "Rust", "Next.js", "Flutter", "Kubernetes", "OpenAI API", "PyTorch", "Tailwind CSS"].includes(skill)) {
                        growthFactor += (yearDiff * 0.22);
                    }
                    // Stable / Enterprise Growth
                    else if (["Java", "C#", "Spring Boot", ".NET Core", "SQL", "React", "Docker", "PostgreSQL"].includes(skill)) {
                        growthFactor += (yearDiff * 0.10);
                    }
                    // Decline / Stagnant
                    else if (["PHP", "Ruby", "Objective-C", "jQuery", "Angular"].includes(skill)) {
                        growthFactor -= (yearDiff * 0.02); // Slow decline or flat
                    }
                    // Normal
                    else {
                        growthFactor += (yearDiff * 0.08);
                    }

                    // Apply Regional Bias
                    if (region === "TR") {
                        const bias = TR_BIAS[skill] || 1.0;
                        growthFactor *= bias;
                    }

                    // Add some randomness per year
                    const variation = 0.92 + Math.random() * 0.16; // +/- 8%

                    let count = Math.floor(baseCount * growthFactor * variation);
                    if (count < 5) count = 5;

                    data.push({
                        id: idCounter++,
                        year,
                        skill,
                        category,
                        count,
                        region
                    });
                });
            });
        });
    });

    return data;
}

function saveData(data) {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Sort: Region -> Year -> Count Desc
    data.sort((a, b) => {
        if (a.region !== b.region) return a.region.localeCompare(b.region);
        if (a.year !== b.year) return a.year - b.year;
        return b.count - a.count;
    });

    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log("Done! Data successfully updated.");
}

const rawData = generateData();
saveData(rawData);
