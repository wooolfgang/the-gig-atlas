import axios from 'axios';
import prisma from '@thegigatlas/prisma';
import config from '../../config';

const { testUrl } = config;

const filesToDelete = [];

afterAll(async () => {
  try {
    await prisma.deleteManyFiles({
      id_in: filesToDelete,
    });
  } catch (e) {
    console.log('Fail gracefully');
  }
});

describe('Upload image crud', () => {
  // Todo -> Make this test run correctly
  it.skip('Correctly uploads image without needing authentication', async () => {
    // eslint-disable-next-line operator-linebreak
    const fileUrl =
      'https://images.unsplash.com/photo-1550645612-83f5d594b671?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=20&q=80';
    const res = await fetch(fileUrl);
    const blob = await res.blob();
    const file = new File([blob], 'dot.jpeg', blob);
    let fileRes = {};
    try {
      fileRes = await axios.post(testUrl, {
        query: `
        mutation IMAGE_UPLOAD($file: Upload!) {
          uploadImage(file: $file) {
            id
            name
            url
          }
        }
        `,
        variables: {
          file,
        },
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
    expect(fileRes.url).toEqual(fileUrl);
  });
});
