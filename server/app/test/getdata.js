const request = require('request-promise-native')
const fs = require('fs');
const http = require('http');

let getData = async () => {
    const options = {
            url: `https://www.zhihu.com/question/30018273`,
            method: 'GET',
            headers: {
                'Cookie': 'l_n_c=1; l_cap_id=; z_c0="MS4xZHJNQUFBQUFBQUFYQUFBQVlRSlZUWC1qVlZ1ckFrWGdILTNuV2JjMXlTVXljMjAwaEFGRkJ3PT0= |1516787071 | 0 c316a9548e72777dd560513e5a91ddfc19e8d0e "; n_c=',
                'Accept-Encoding': 'deflate, sdch, br' // 不允许gzip,开启gzip会开启知乎客户端渲染，导致无法爬取
            }
        }

    // request('https://www.zhihu.com/question/30018273', function(error, response, body) {
    //     console.log('error:', error); // Print the error if one occurred
    //     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //     fs.writeFileSync('test.txt', body);
    // })

    let res = await request('https://www.zhihu.com/question/30018273');
    console.log(res);
    
}

getData();