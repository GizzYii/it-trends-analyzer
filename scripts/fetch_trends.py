import pandas as pd
import json
import random
import os
from datetime import datetime

# --- CONFIGURATION ---
DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), '../src/data/trends.json')

# Expanded Categories including IDEs, OS, and extended lists
CATEGORIES = {
    "Frontend": ["React", "Next.js", "Vue.js", "Angular", "Svelte", "Tailwind CSS", "TypeScript", "HTML5/CSS3", "Redux"],
    "Backend": ["Node.js", "Go", "Rust", "Python", "Java (Spring)", "C# (.NET Core)", "PHP", "Ruby on Rails", "FastAPI"],
    "Mobile": ["Flutter", "React Native", "Swift", "Kotlin", "Dart", "Ionic", "Xamarin"],
    "DevOps": ["Docker", "Kubernetes", "AWS", "Terraform", "Azure", "GitHub Actions", "Jenkins", "Ansible", "Prometheus", "Grafana"],
    "Test": ["Selenium", "Cypress", "Playwright", "Jest", "Appium", "JUnit", "Mocha"],
    "Data": ["Python", "TensorFlow", "PyTorch", "Pandas", "SQL", "OpenAI API", "Spark", "Hadoop", "Scikit-learn"],
    "Database": ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Cassandra", "Elasticsearch", "Neo4j"],
    "Tools": ["VS Code", "IntelliJ IDEA", "Git", "Jira", "Postman", "Figma", "Notion"],
    "OS": ["Linux", "Windows", "MacOS", "Android", "iOS", "Ubuntu", "CentOS"]
}

def fetch_mock_data():
    """
    Simulates fetching data from external sources.
    """
    print("Fetching data from external sources...")
    
    data = []
    id_counter = 1
    # Extended years up to 2026
    years = [2022, 2023, 2024, 2025, 2026]
    
    for year in years:
        for category, skills in CATEGORIES.items():
            for skill in skills:
                # Base random count
                base_count = random.randint(30, 120)
                
                # Growth logic
                growth_factor = 1.0
                
                # Popular tech growth
                if skill in ["React", "Python", "AWS", "Docker", "TypeScript", "OpenAI API", "VS Code", "Rust", "Next.js"]:
                    growth_factor += ((year - 2022) * 0.25) # Strong growth
                # Stable/Legacy
                elif skill in ["Java (Spring)", "C# (.NET Core)", "SQL", "Linux", "Git"]:
                    growth_factor += ((year - 2022) * 0.05) # Slow steady growth
                # Declining (hypothetical for simulation variety)
                elif skill in ["PHP", "Ruby on Rails", "Xamarin"]:
                     growth_factor -= ((year - 2022) * 0.05)
                else:
                    growth_factor += ((year - 2022) * 0.15) # Moderate growth

                # Add some randomness per year
                variation = random.uniform(0.9, 1.1)
                
                count = int(base_count * growth_factor * variation)
                if count < 5: count = 5
                
                data.append({
                    "id": id_counter,
                    "year": year,
                    "skill": skill,
                    "category": category,
                    "count": count
                })
                id_counter += 1
                
    return data

def process_data(raw_data):
    """
    Process data using Pandas
    """
    print("Processing data with Pandas...")
    df = pd.DataFrame(raw_data)
    
    # Sort by year, category, and count descending
    df = df.sort_values(by=['year', 'category', 'count'], ascending=[True, True, False])
    
    return df

def save_to_json(df):
    """
    Save processed data to JSON file
    """
    print(f"Saving data to {DATA_FILE_PATH}...")
    
    os.makedirs(os.path.dirname(DATA_FILE_PATH), exist_ok=True)
    
    result = df.to_dict(orient='records')
    
    with open(DATA_FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        
    print("Done! Data successfully updated.")

if __name__ == "__main__":
    raw_data = fetch_mock_data()
    df = process_data(raw_data)
    save_to_json(df)
