#!/bin/bash

# Run the mine script in the background
echo 'Launching mine'
/code/scripts/mine.sh &

# Start the bcoin node
node /code/bcoin/bin/node --network=regtest --http-host=0.0.0.0 --wallet-http-host=0.0.0.0 --api-key=secretpw --max-outbound=1 --coinbase-address=bc1qf6agt2r555t3xnk0tf5yx3tuhlmav3rt9zx3up
