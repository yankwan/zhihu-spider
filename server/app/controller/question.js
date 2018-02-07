const service = require('../service/question')
const spider = require('../service/spider')
const App = require('./app')
const getQidByUrl = (url) => {

    try {
        const reg = /www.zhihu.com\/question\/(\d*)/
        return url.match(reg)[1]
    } catch (err) {
        return false
    }
}
class Question extends App {
    async search(ctx) {
        const query = ctx.request.query
        super.result(await service.search(ctx.authInfo, query))
    }
    async quickSearch(ctx) {
        const { token } = ctx.request.query
        const rs = await spider.quickSearch(ctx.authInfo.cookie, token)
        super.result(rs)
    }
    async create(ctx) {
        console.log("question create...");
        // 传入question对象
        let { qid, url } = ctx.request.body
        if (!qid && !url) {
            super.error('别瞎填')
            return
        }
        qid = qid | getQidByUrl(url)
        if (!qid) {
            super.error('url错误')
            return
        }
        let result = await service.add(ctx.authInfo, qid);
        super.result(result)
    }
    // 获取问题列表
    async get(ctx) {
        console.log("question get....")
        let { page = 1, size = 10, status = 1 } = ctx.request.query
        page = Number(page)
        size = Number(size)

        // 选择条件
        const cond = {
            userId: ctx.header.authorization,
            status: Number(status)
        }
        ctx.body = {
            data: await service.get(page, size, cond),
            pageData: {
                page: page,
                size: size
            }
        }
    }
    async stop(ctx) {
        const { qid } = ctx.params
        ctx.body = await service.stop(qid, ctx.header.authorization)
    }
    async reActive(ctx) {
        const { qid } = ctx.params
        ctx.body = await service.reActive(qid, ctx.header.authorization)
    }
    async explore(ctx) {
        const { offset } = ctx.params
        let result = await service.explore(ctx.authInfo, offset);
        super.result(result)
    }
}
module.exports = new Question()
