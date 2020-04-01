/* Fetch data
 * @param {number} [page] - Page of data to return, optional
 * @returns {Promise} Promise Object - Payload of the request
 */

const { getData } = require('./api');

/*
 * Working with legacy and unrealiable APIs is a common problem we have to
 * solve for at Point. For this challenge you must sucessfully fetch all pages from
 * an external API and sum all of the pages of data to a single integer value.
 * An example succesfully response from the API is:
 *
    {
      "data": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
      "page": 0,
      "pageCount": 15
    }
 *
 * Things to watch out for:
 *  1. The API is rated limted and only allows 5 requests per 3 seconds
 *  2. The API is unrealiable and has been known to fail randomly
 *
 *  Good luck!
 */

function delay () {
  return new Promise((resolve, _) => {
    setTimeout(resolve, parseInt(3000 / 5))
  })
}

async function main() {
  let sum = 0;
  let pageCount = 1;
  let currentPage = 0;
  let retries = 3;

  console.debug('Starting to get data')

  while (currentPage < pageCount) {
    // TODO: validations
    try {
      const {
        data,
        page,
        pageCount: count
      } = await getData(currentPage)

      console.debug('Finished request for page: ', page)

      sum += data.reduce((acc, i) => acc += i, 0)
      currentPage = page + 1
      pageCount = count
      retries = 3
    } catch (e) {
      console.error(`Error during ${currentPage} main ${e.message}`, e)
      retries -= 1

      if (retries === 0 ) {
        throw new Error('Completely failed')
      }
    }

    if (currentPage < pageCount) {
      await delay()
    }
  }

  console.log(`The total sum is: ${sum}`);
}

main();
