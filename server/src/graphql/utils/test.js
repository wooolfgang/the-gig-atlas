import { purify } from './rules';

describe('dompurify', () => {
  it('Purify function properly works', () => {
    const input = {
      person: {
        description: '<img src=x onerror=alert(1)//>',
      },
    };
    const fields = ['person', 'description'];
    const res = purify(fields, input);
    expect(res).toBe(true);
    expect(input.person.description).toBe('<img src="x">');
  });

  it('Should fail when field value does not match', () => {
    const input = {
      person: {
        description: {
          something: 'this is something',
        },
      },
    };
    const fields = ['person', 'description'];
    expect(() => purify(fields, input)).toThrowError(
      'Error trying to sanitize an input that is not a valid string',
    );
  });
});
