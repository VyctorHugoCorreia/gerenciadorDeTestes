import { saveAs } from 'file-saver';

interface Step {
    step: number;
    status: string;
    description: string;
}


interface TestSuite {
    idTestSuite: number;
    descTestSuite: string;
}

interface TestScenario {
    idScenario: number;
    titleScenario: string;
    descScenario: string;
    linkScenario: string;
    idTestSuite: TestSuite;
    steps: Step[];
    tags: string[];
    dateCreation: string;
    dateUpdate: string;
}

function generateGherkin(scenarios: TestScenario[]): string {
    const descTestSuite = scenarios.length > 0 ? scenarios[0].idTestSuite.descTestSuite : '';
    let gherkin = `# language: pt\n\n`;

    gherkin += `Funcionalidade: ${descTestSuite}\n\n`;

    scenarios.forEach(scenario => {
        gherkin += `@${scenario.tags.join(' @')}\n`;
        gherkin += `Cenario: ${scenario.titleScenario}\n`;
        scenario.steps.forEach(step => {
            gherkin += `  ${step.description}\n`;
        });
        gherkin += `\n`;
    });

    return gherkin;
}

export function generateFeatureFile(scenarios: TestScenario[]): void {
    const descTestSuite = scenarios.length > 0 ? scenarios[0].idTestSuite.descTestSuite : '';
    const gherkin = generateGherkin(scenarios);
    const blob = new Blob([gherkin], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, descTestSuite + '.feature');
}
