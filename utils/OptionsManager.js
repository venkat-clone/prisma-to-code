const path = require('path');

class OptionsManager {
    constructor(cliOptions, defaultPaths) {
        this.cliOptions = cliOptions;
        this.defaultPaths = defaultPaths;
        this.options = {};
    }

    parseArguments(args) {
        this.options = Object.keys(this.cliOptions).reduce((acc, key) => {
            const option = this.cliOptions[key];
            const isEnabled = args.includes(option.flag);
            acc[key] = isEnabled;
            
            // Include sub-options if they exist and option is enabled
            if (isEnabled && option.subOptions) {
                acc[`${key}Options`] = option.subOptions;
            }
            return acc;
        }, {});

        // Parse paths
        this.options.schemaPath = args[0] && !args[0].startsWith('-')
            ? path.resolve(process.cwd(), args[0])
            : path.resolve(process.cwd(), this.defaultPaths.schema);

        this.options.outputDir = args[1] && !args[1].startsWith('-')
            ? path.resolve(process.cwd(), args[1])
            : path.resolve(process.cwd(), this.defaultPaths.output);

        return this.options;
    }

    generateHelpText() {
        const optionsText = Object.entries(this.cliOptions)
            .map(([key, opt]) => {
                let text = `  ${opt.flag}\t${opt.description}`;
                if (opt.subOptions) {
                    const subOpts = Object.keys(opt.subOptions)
                        .map(so => `\n    - ${so}`).join('');
                    text += ` (Includes:${subOpts})`;
                }
                return text;
            })
            .join('\n');

        return `
            Usage: prisma-to-code <schema_file_path> <output_directory> [options]

            Arguments:
            <schema_file_path>  Path to the Prisma schema file. (Default: './${this.defaultPaths.schema}')
            <output_directory>  Directory where generated code should be saved. (Default: './${this.defaultPaths.output}')

            Options:
            ${optionsText}
            -h, --help          Show this help message.

            Examples:
            prisma-to-code ./prisma/schema.prisma ./output ${Object.values(this.cliOptions).map(opt => opt.flag).join(' ')}
            prisma-to-code (uses default paths)
                `;
    }

    async promptForMissingOptions(askQuestion) {
        for (const [key, opt] of Object.entries(this.cliOptions)) {
            if (!this.options[key] && opt.default) {
                const response = await askQuestion(opt.prompt);
                const isEnabled = response.toLowerCase() === 'yes';
                this.options[key] = isEnabled;
                
                if (isEnabled && opt.subOptions) {
                    this.options[`${key}Options`] = opt.subOptions;
                }
            }
        }
        return this.options;
    }

    getOptions() {
        return this.options;
    }
}

module.exports = OptionsManager;
