// file: markdownParser.test.js
import fs from 'fs';
import markdownlint from 'markdownlint';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

// Function to count the level-2 headers in a Markdown string
const countLevel2Headers = (markdownContent) => {
  const tokens = md.parse(markdownContent, {});
  return tokens.filter(token => token.type === 'heading_open' && token.tag === 'h2').length;
}

const validateLevel2Headers = (markdownContent) => {
  const tokens = md.parse(markdownContent, {});
  const level2Headers = tokens.filter(token => token.type === 'heading_open' && token.tag === 'h2');

  // Regular expression to match the format "Step [0-9]+"
  const stepFormat = /^Step [0-9]+$/;

  // Check each level-2 header against the regular expression
  return level2Headers.every(header => {
    const nextToken = tokens[tokens.indexOf(header) + 1];
    return stepFormat.test(nextToken.content.trim());
  });
}

const steps = (markdownContent) => {
  // Split content based on the pattern ## Step followed by any number
  // We use a positive lookahead to keep the delimiter (## Step N) at the start of each resulting split element
  const steps = markdownContent.split(/(?=## Step \d+)/g);

  // Filter out any elements that don't start with "## Step" to exclude non-step elements
  // and remove the "## Step N" line from each step's content
  return steps
    .filter(step => step.trim().startsWith('## Step'))
    .map(step => step.replace(/^## Step \d+\n/, '').trim());
};

// Load the Markdown content from a file
process.env.MARKDOWN_FILES_PATH.split(" ").forEach(filePath => {
  if (!filePath) {
    throw new Error('MARKDOWN_FILE_PATH environment variable is not set.');
  }
  // Jest test
  describe(`Markdown parsing for ${filePath}`, () => {
    const markdownContent = fs.readFileSync(filePath, 'utf8');
    test('lint Markdown content with markdownlint', (done) => {
      const options = {
        "files": [filePath],
        "config": {
          "default": true,
          "MD013": false,
          "MD033": false
        }
      };

      markdownlint(options, function (err, result) {
        if (err) {
          done(err);
        } else {
          const resultString = result.toString();
          if (resultString) {
            console.error(resultString);
          }
          expect(resultString).toBe('');
          done();
        }
      });
    });

    test('matches the number of level-2 headers with expected count', () => {

      // Count how many times "##" appears in the content (as an approximation)
      const manualCount = (markdownContent.match(/## /g) || []).length;
      // Use markdown-it to count level-2 headers
      const parsedCount = countLevel2Headers(markdownContent);
      // Expect the counts to match
      expect(parsedCount).toEqual(manualCount);
    });

    test('check that the headers are in the correct format', () => {
      const isValid = validateLevel2Headers(markdownContent);

      expect(isValid).toBe(true);
    });

    describe('Each step is the correct format', () => {
      const allSteps = steps(markdownContent);
      allSteps.forEach((stepContent, index) => {
        describe(`Step ${index + 1}`, () => {
          test(`Starts with something to "Say":`, () => {
            // Check that the step starts with "Say:"
            expect(stepContent.startsWith('- Say:')).toBe(true);

            //  Starts with "Say:" and contains only one "Say"
            const sayCount = (stepContent.match(/- Say:/g) || []).length;
            expect(sayCount).toBe(1);
          });

          test(`Has an optional "Question":`, () => {
            // Include optionalluy a "Question:"
            const questionCount = (stepContent.match(/- Question:/g) || []).length;
            expect(questionCount).toBeLessThanOrEqual(1);
          });

          test(`Has an optional "Expected Correct Answer and Reasoning":`, () => {
            // Include optionalluy a "Question:"
            const questionCount = (stepContent.match(/- Expected Correct Answer and Reasoning:/g) || []).length;
            expect(questionCount).toBeLessThanOrEqual(1);
          });

          test('If present, "Expected Correct Answer and Reasoning" is in the right format', () => {
            const lines = stepContent.split('\n');

            // Iterate through the lines to find "- Expected Correct Answer and Reasoning:"
            for (let i = 0; i < lines.length - 1; i++) { // Adjusted to -1 because "- Correct Reasoning:" is optional
              if (lines[i].trim() === '- Expected Correct Answer and Reasoning:') {
                // Ensure the next line is "- Correct Answer:"
                expect(lines[i + 1].trim().startsWith('- Correct Answer:')).toBe(true);

                // If "- Correct Reasoning:" is present, it must follow "- Correct Answer:"
                if (i + 2 < lines.length && lines[i + 2].trim().startsWith('- Correct Reasoning:')) {
                  expect(lines[i + 2].trim().startsWith('- Correct Reasoning:')).toBe(true);
                }
                break; // Exit the loop once the checks are complete
              }
            }
          });

          test(`Has an optional "Feedback and Action Instructions:":`, () => {
            // Include optionalluy a "Question:"
            const questionCount = (stepContent.match(/- Feedback and Action Instructions::/g) || []).length;
            expect(questionCount).toBeLessThanOrEqual(1);
          });

          test('Contains no unexpected tags', () => {
            // Find all lines that start with "-" and end with ":"
            const allTags = stepContent.match(/- [^:]+:/g) || [];

            // Define the list of expected tags
            const expectedTags = [
              '- Say:',
              '- Question:',
              '- Expected Correct Answer and Reasoning:',
              '- Correct Answer:',
              '- Correct Reasoning:',
              '- Possible Misconception:',
              '- Feedback and Action Instructions:'
            ];
            // Filter out the expected tags from all found tags
            const unexpectedTags = allTags.filter(tag => !expectedTags.includes(tag.trim()));

            // Assert that no unexpected tags remain
            expect(unexpectedTags.join(",")).toBe("");
          });
        });
      });
    });
  });
});