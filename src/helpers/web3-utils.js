import promisify from "./web3-promisfy";

export function getBlockDeadline(web3, deadline) {
  return new Promise(async (resolve, reject) => {

    const block = await web3.trx.getCurrentBlock() ; //promisify(web3, 'getBlockNumber');
 

    if (!block) {
      return reject();
    }

    console.log( "block", block.block_header.raw_data.timestamp)

    resolve(block.block_header.raw_data.timestamp + deadline);
  });
}
