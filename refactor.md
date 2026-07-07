Refaktorer prosjektet og del opp js/script.js i flere ES6-moduler uten å endre eksisterende funksjonalitet.

Mål:
- Gjør koden enklere å vedlikeholde.
- Gjør det enkelt å legge til nye oppgavetyper senere.
- Behold all eksisterende funksjonalitet.
- Bruk ES Modules (import/export).
- Oppdater index.html slik at js/script.js lastes som module.

Ønsket mappestruktur:

MathWeb/
│
├── index.html
├── styles.css
│
├── js/
│   ├── script.js
│   │
│   ├── config/
│   │   ├── difficulties.js
│   │   └── sections.js
│   │
│   ├── profiles/
│   │   └── ages.js
│   │
│   ├── utils/
│   │   ├── random.js
│   │   ├── math.js
│   │   └── formatting.js
│   │
│   ├── figures/
│   │   ├── rectangle.js
│   │   └── triangle.js
│   │
│   ├── generators/
│   │   ├── addSub.js
│   │   ├── mulDiv.js
│   │   ├── fractionPercent.js
│   │   ├── geometry.js
│   │   ├── trigonometry.js
│   │   ├── word.js
│   │   └── index.js
│   │
│   └── rendering/
│       ├── worksheet.js
│       ├── section.js
│       └── problem.js

Flytt følgende:

1. constants og konfigurasjon
- Difficulty -> config/difficulties.js
- SECTION_DEFS -> config/sections.js

2. profiler
- getAgeProfile -> profiles/ages.js

3. hjelpefunksjoner
- randomInt
- pickOne
- gcd
- toFixedClean
- normalizeDifficulty
- difficultyFactor

Flyttes til utils-filer.

4. SVG-funksjoner
- makeRectangleSvg -> figures/rectangle.js
- makeTriangleSvg -> figures/triangle.js

5. oppgavegeneratorer
- generateAddSubProblem -> generators/addSub.js
- generateMulDivProblem -> generators/mulDiv.js
- generateFractionPercentProblem -> generators/fractionPercent.js
- generateGeometryProblem -> generators/geometry.js
- generateTrigonometryProblem -> generators/trigonometry.js
- generateWordProblem -> generators/word.js

Opprett generators/index.js som eksporterer:

export const generatorMap = {
  addSub,
  mulDiv,
  fractionPercent,
  geometry,
  trigonometry,
  word
};

6. rendering
Flytt:
- createProblemItemElement
- createSectionElement
- buildWorksheetElement
- generateSectionProblems
- uniqueProblem

til rendering-moduler.

7. js/script.js
js/script.js skal etter refaktorering hovedsakelig inneholde:

- DOM-element referanser
- global state (answersVisible)
- renderWorksheets()
- updateAnswerVisibility()
- updateFigureVisibility()
- event listeners
- imports

Krav:
- Generer alle nye filer.
- Legg inn alle nødvendige import/export-setninger.
- Oppdater relative paths korrekt.
- Ikke endre eksisterende oppgavetekster eller matematikk.
- Ikke introduser TypeScript.
- Ikke introduser byggverktøy som webpack eller vite.
- Prosjektet skal fortsatt kunne kjøres ved å åpne index.html i nettleseren.

Vis hele innholdet i hver ny fil.
Arbeid fil for fil og vis ferdig innhold for hver opprettet fil. Ikke gi bare eksempler. Generer komplett kjørbar kode.