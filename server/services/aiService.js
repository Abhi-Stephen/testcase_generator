function createId() {
  return `tc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildTestCase({ title, description, steps, expectedResult, priority, type, testData }) {
  return {
    id: createId(),
    title,
    description,
    steps,
    expectedResult,
    priority,
    type,
    testData
  };
}

function getScenario(requirement) {
  const normalizedRequirement = requirement.toLowerCase();

  if (/login|log in|sign in|authentication/.test(normalizedRequirement)) {
    return 'login';
  }

  if (/signup|register|registration/.test(normalizedRequirement)) {
    return 'signup';
  }

  if (/search|find|filter/.test(normalizedRequirement)) {
    return 'search';
  }

  if (/checkout|payment|purchase|order/.test(normalizedRequirement)) {
    return 'checkout';
  }

  return 'generic';
}

function getTestCasesForScenario(requirement, scenario) {
  const baseTitle = requirement.trim();

  if (scenario === 'login') {
    return [
      buildTestCase({
        title: 'Valid login with correct credentials',
        description: `Verify that a user can log in successfully for: ${baseTitle}`,
        steps: [
          'Open the login page.',
          'Enter a valid username.',
          'Enter a valid password.',
          'Click the Sign In button.'
        ],
        expectedResult: 'The user is authenticated and redirected to the dashboard.',
        priority: 'High',
        type: 'Positive',
        testData: {
          username: 'valid.user@example.com',
          password: 'Valid@1234'
        }
      }),
      buildTestCase({
        title: 'Invalid password should show an error',
        description: 'Verify that an invalid password is rejected with a clear validation message.',
        steps: [
          'Open the login page.',
          'Enter a valid username.',
          'Enter an invalid password.',
          'Click the Sign In button.'
        ],
        expectedResult: 'An error message is shown and the user remains on the login page.',
        priority: 'High',
        type: 'Negative',
        testData: {
          username: 'valid.user@example.com',
          password: 'WrongPass1'
        }
      }),
      buildTestCase({
        title: 'Blank username validation',
        description: 'Verify that the form blocks submission when the username is missing.',
        steps: [
          'Open the login page.',
          'Leave the username field blank.',
          'Enter a valid password.',
          'Click the Sign In button.'
        ],
        expectedResult: 'The UI shows a required-field validation message for username.',
        priority: 'Medium',
        type: 'Validation',
        testData: {
          username: '',
          password: 'Valid@1234'
        }
      }),
      buildTestCase({
        title: 'Blank password validation',
        description: 'Verify that the form blocks submission when the password is missing.',
        steps: [
          'Open the login page.',
          'Enter a valid username.',
          'Leave the password field blank.',
          'Click the Sign In button.'
        ],
        expectedResult: 'The UI shows a required-field validation message for password.',
        priority: 'Medium',
        type: 'Validation',
        testData: {
          username: 'valid.user@example.com',
          password: ''
        }
      }),
      buildTestCase({
        title: 'Leading and trailing spaces are handled correctly',
        description: 'Verify that extra spaces around credentials do not break the login flow.',
        steps: [
          'Open the login page.',
          'Enter a username with leading and trailing spaces.',
          'Enter a password with a trailing space.',
          'Click the Sign In button.'
        ],
        expectedResult: 'The application trims supported inputs or shows a clear validation response.',
        priority: 'Low',
        type: 'Edge Case',
        testData: {
          username: '  valid.user@example.com  ',
          password: 'Valid@1234 '
        }
      })
    ];
  }

  if (scenario === 'signup') {
    return [
      buildTestCase({
        title: 'Successful account registration',
        description: `Verify that a new user can register for: ${baseTitle}`,
        steps: [
          'Open the registration page.',
          'Enter a valid name, email, and password.',
          'Accept the terms if required.',
          'Submit the form.'
        ],
        expectedResult: 'The account is created and the user sees a success message.',
        priority: 'High',
        type: 'Positive',
        testData: {
          name: 'Aarav Patel',
          email: 'aarav.patel@example.com',
          password: 'Signup@1234'
        }
      }),
      buildTestCase({
        title: 'Duplicate email should be rejected',
        description: 'Verify that the system prevents registration with an email that already exists.',
        steps: [
          'Open the registration page.',
          'Enter an email that already exists.',
          'Fill in the remaining fields.',
          'Submit the form.'
        ],
        expectedResult: 'The user sees an error that the email is already registered.',
        priority: 'High',
        type: 'Negative',
        testData: {
          email: 'existing.user@example.com'
        }
      }),
      buildTestCase({
        title: 'Password policy validation',
        description: 'Verify that weak passwords are rejected during signup.',
        steps: [
          'Open the registration page.',
          'Enter a weak password.',
          'Complete the other fields.',
          'Submit the form.'
        ],
        expectedResult: 'A password strength message is shown and the account is not created.',
        priority: 'Medium',
        type: 'Validation',
        testData: {
          password: '12345678'
        }
      }),
      buildTestCase({
        title: 'Required fields cannot be blank',
        description: 'Verify that empty mandatory fields are blocked before submission.',
        steps: [
          'Open the registration page.',
          'Leave name and email blank.',
          'Enter a valid password.',
          'Submit the form.'
        ],
        expectedResult: 'The UI highlights the required fields and prevents submission.',
        priority: 'Medium',
        type: 'Validation',
        testData: {
          name: '',
          email: '',
          password: 'Signup@1234'
        }
      })
    ];
  }

  if (scenario === 'search') {
    return [
      buildTestCase({
        title: 'Search returns matching results',
        description: `Verify that the user can search successfully for: ${baseTitle}`,
        steps: [
          'Open the search page.',
          'Enter a valid search term.',
          'Click the Search button.'
        ],
        expectedResult: 'Matching results are shown in the results area.',
        priority: 'High',
        type: 'Positive',
        testData: {
          searchTerm: 'laptop'
        }
      }),
      buildTestCase({
        title: 'No results message for unmatched terms',
        description: 'Verify the system shows a no-results message when nothing matches.',
        steps: [
          'Open the search page.',
          'Enter a term with no matches.',
          'Click the Search button.'
        ],
        expectedResult: 'A friendly no-results message is displayed.',
        priority: 'Medium',
        type: 'Negative',
        testData: {
          searchTerm: 'zxqv-999'
        }
      }),
      buildTestCase({
        title: 'Blank search term validation',
        description: 'Verify that the search action does not run with an empty query.',
        steps: [
          'Open the search page.',
          'Leave the search field blank.',
          'Click the Search button.'
        ],
        expectedResult: 'The UI asks the user to enter a search term.',
        priority: 'Medium',
        type: 'Validation',
        testData: {
          searchTerm: ''
        }
      }),
      buildTestCase({
        title: 'Search with special characters',
        description: 'Verify that the search input handles special characters safely.',
        steps: [
          'Open the search page.',
          'Enter special characters in the search box.',
          'Click the Search button.'
        ],
        expectedResult: 'The search runs safely or shows a validation message without crashing.',
        priority: 'Low',
        type: 'Edge Case',
        testData: {
          searchTerm: '@#$%^&*()'
        }
      })
    ];
  }

  if (scenario === 'checkout') {
    return [
      buildTestCase({
        title: 'Successful checkout with valid payment details',
        description: `Verify a successful purchase flow for: ${baseTitle}`,
        steps: [
          'Add an item to the cart.',
          'Open the checkout page.',
          'Enter valid shipping and payment details.',
          'Confirm the order.'
        ],
        expectedResult: 'The order is placed successfully and an order confirmation is shown.',
        priority: 'High',
        type: 'Positive',
        testData: {
          cardNumber: '4111111111111111',
          expiry: '12/29',
          cvv: '123'
        }
      }),
      buildTestCase({
        title: 'Invalid card details should fail',
        description: 'Verify that an invalid payment method is rejected.',
        steps: [
          'Open the checkout page.',
          'Enter an invalid card number.',
          'Complete the remaining required fields.',
          'Confirm the order.'
        ],
        expectedResult: 'The payment is declined and the user sees a validation message.',
        priority: 'High',
        type: 'Negative',
        testData: {
          cardNumber: '1234'
        }
      }),
      buildTestCase({
        title: 'Missing shipping information validation',
        description: 'Verify that required shipping fields cannot be left blank.',
        steps: [
          'Open the checkout page.',
          'Leave shipping address fields blank.',
          'Enter valid payment details.',
          'Confirm the order.'
        ],
        expectedResult: 'The UI highlights the missing shipping information fields.',
        priority: 'Medium',
        type: 'Validation',
        testData: {
          shippingAddress: ''
        }
      }),
      buildTestCase({
        title: 'Expired card should be blocked',
        description: 'Verify that checkout does not proceed with an expired card.',
        steps: [
          'Open the checkout page.',
          'Enter an expired card date.',
          'Submit the order.'
        ],
        expectedResult: 'The user sees an error stating the card has expired.',
        priority: 'Medium',
        type: 'Edge Case',
        testData: {
          expiry: '01/20'
        }
      }),
      buildTestCase({
        title: 'Apply coupon with zero discount',
        description: 'Verify the checkout flow behaves correctly when a coupon gives no discount.',
        steps: [
          'Open the checkout page.',
          'Enter a coupon code with zero discount.',
          'Confirm the order.'
        ],
        expectedResult: 'The order total remains unchanged and the checkout continues normally.',
        priority: 'Low',
        type: 'Edge Case',
        testData: {
          couponCode: 'ZERO0'
        }
      })
    ];
  }

  return [
    buildTestCase({
      title: `Happy path for ${baseTitle}`,
      description: `Verify that the main flow works for: ${baseTitle}`,
      steps: [
        `Open the screen or feature related to ${baseTitle}.`,
        'Enter valid input data.',
        'Submit or confirm the action.'
      ],
      expectedResult: 'The expected success outcome is displayed.',
      priority: 'High',
      type: 'Positive',
      testData: {
        input: 'Valid sample data'
      }
    }),
    buildTestCase({
      title: `Invalid data validation for ${baseTitle}`,
      description: 'Verify that invalid data is rejected with a clear message.',
      steps: [
        `Open the feature for ${baseTitle}.`,
        'Enter invalid or unsupported data.',
        'Submit the form or action.'
      ],
      expectedResult: 'The application shows a validation message and stops submission.',
      priority: 'High',
      type: 'Negative',
      testData: {
        input: 'Invalid sample data'
      }
    }),
    buildTestCase({
      title: `Missing mandatory field validation for ${baseTitle}`,
      description: 'Verify that required fields cannot be submitted when blank.',
      steps: [
        `Open the feature for ${baseTitle}.`,
        'Leave a required field empty.',
        'Attempt to submit.'
      ],
      expectedResult: 'The system highlights the missing field and prevents submission.',
      priority: 'Medium',
      type: 'Validation',
      testData: {
        input: ''
      }
    }),
    buildTestCase({
      title: `Boundary or edge scenario for ${baseTitle}`,
      description: 'Verify how the system behaves with a boundary or edge case input.',
      steps: [
        `Open the feature for ${baseTitle}.`,
        'Enter a boundary-value input or unusual data.',
        'Submit and observe the response.'
      ],
      expectedResult: 'The application handles the edge case safely and predictably.',
      priority: 'Low',
      type: 'Edge Case',
      testData: {
        input: 'Boundary value'
      }
    })
  ];
}

function generateMockTestCases(requirement) {
  const scenario = getScenario(requirement);
  return getTestCasesForScenario(requirement, scenario);
}

function normalizeGeneratedTestCases(testCases) {
  if (!Array.isArray(testCases)) {
    return [];
  }

  return testCases
    .filter((testCase) => testCase && typeof testCase === 'object')
    .map((testCase) => ({
      id: testCase.id || createId(),
      title: testCase.title || 'Untitled test case',
      description: testCase.description || '',
      steps: Array.isArray(testCase.steps) ? testCase.steps : [],
      expectedResult: testCase.expectedResult || '',
      priority: testCase.priority || 'Medium',
      type: testCase.type || 'Functional',
      testData: testCase.testData || {}
    }))
    .slice(0, 5);
}

async function generateStructuredTestCases(requirement) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return generateMockTestCases(requirement);
  }

  try {
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const response = await client.chat.completions.create({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You generate realistic manual QA test cases. Return valid JSON only with a top-level "testCases" array. Each test case must include id, title, description, steps array, expectedResult, priority, type, and testData.'
        },
        {
          role: 'user',
          content: [
            'Create 3 to 5 test cases for the following requirement or user story.',
            `Requirement: ${requirement}`,
            'Use realistic positive, negative, validation, and edge-case scenarios when appropriate.',
            'Keep the structure concise and practical for QA execution.'
          ].join('\n')
        }
      ]
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
      return generateMockTestCases(requirement);
    }

    const parsedContent = JSON.parse(content);
    const extractedTestCases = Array.isArray(parsedContent) ? parsedContent : parsedContent.testCases;
    const normalizedTestCases = normalizeGeneratedTestCases(extractedTestCases);

    if (!normalizedTestCases.length) {
      return generateMockTestCases(requirement);
    }

    return normalizedTestCases;
  } catch (error) {
    return generateMockTestCases(requirement);
  }
}

module.exports = {
  generateMockTestCases,
  generateStructuredTestCases
};