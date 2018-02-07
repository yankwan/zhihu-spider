const spiderService = require('./spider')
const QuestionModel = require('../model/question')
const HotQuestionModel = require('../model/hot_question')
const dataService = require('../service/data')
const LOGGING = true;
module.exports = {
	// 获取问题列表
	async get(page, size, cond = {}) {
		cond.isDeleted = cond.isDeleted | false
		const qs = await QuestionModel
			.find(cond)
			.sort({ createTime: -1 })
			.skip((page - 1) * size)
			.limit(size)
			.lean()
			.exec()
		if (LOGGING) console.log(qs);
		const qids = qs.map(q => q.qid)
		console.log(qids);
		const data = await dataService.getGroupData(qids)
		const dataMap = {}
		data.forEach(d => {
			dataMap[d._id] = d
		})
		qs.forEach((q, k) => {
			q.data = dataMap[q.qid]
		})
		return qs
	},

	// 根据qid爬取对应question信息
	// 并存储在数据库
	async add(authInfo, qid) {
		const rs = await spiderService.getData(authInfo.cookie, qid)
		if (!rs.success) {
			return rs
		}
		const { title, data } = rs
		if (!title || data.readers <= 0) {
			return {
				success: false,
				status: 500,
				msg: '爬取失败'
			}
		}
		const question = {
			qid: qid,
			userId: authInfo._id,
			title: title
		}
		
		// 存储对应question的关注数，回答数，阅读数
		// data = {qid:..., readers:..., flowers:..., }
		// Data Model
		const d = await dataService.create(data)
		// 每个document都是model的实例
		// 新增一条记录需要new一个model
		const q = new QuestionModel(question)
		try {
			const que = (await q.save()).toObject()  // 插入的数据
			const qData = await d.save()
			que.data = qData
			// 返回数据
			return {
				success: true,
				question: que
			}
		} catch (err) {
			return {
				success: false,
				status: 500,
				msg: err.errmsg
			}
		}
	},
	async stop(qid, userId) {
		return QuestionModel.findOne({
			qid: qid,
			userId: userId
		}).update({
			status: 0,
			updateTime: new Date()
		})
	},

	// 跟踪
	async reActive(qid, userId) {
		return QuestionModel.findOne({
			qid: qid,
			userId: userId
		}).update({
			status: 1,
			updateTime: new Date(),
			expiredTime: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000)
		})
	},
	async richQuestions(data, userId) {
		const qs = await QuestionModel.find({
			userId: userId,
			qid: { $in: data.qids }
		}).exec()
		const qsMap = {}
		qs.forEach(q => {
			qsMap[q.qid] = q
		})
		data.questions.forEach(q => {
			q.status = 0
			if (qsMap[q.qid]) {
				q.status = qsMap[q.qid].status
				q._id = qsMap[q.qid]._id
			}
		})
		return data
	},
	async search(authInfo, params) {
		const data = await spiderService.search(authInfo.cookie, params)
		if (!data.success) {
			return data
		}
		return this.richQuestions(data, authInfo._id)
	},
	async explore(authInfo, offset = 0, type = 'day') {
		const data = await spiderService.explore(authInfo.cookie, offset)
		if (!data.success) {
			return data
		}
		return this.richQuestions(data, authInfo._id)
	},
	async topicHot(authInfo, topicId, offset) {
		const data = await spiderService.getTopicHot(authInfo.cookie, topicId, offset)
		if (!data.success) {
			return data
		}
		return this.richQuestions(data, authInfo._id)
	},
	async upsertHotQuestion(question, topicId) {
		const cond = {
			qid: question.qid,
			topicId: topicId
		}
		const data = {
			topicId: topicId,
			updateTime: new Date(),
			times: question.times,
			title: question.title,
			pushed: false,
			$inc: {
				totalTimes: question.times
			}
		}
		return HotQuestionModel.findOneAndUpdate(cond, data, {
			upsert: true,
			setDefaultsOnInsert: true,
			new: true
		})
	},
	async getUnpushHotQuestion(topics) {
		const cond = {
			topicId: { $in: topics },
			pushed: false
		}
		return HotQuestionModel.find(cond)
	},
	async pushedHotQuestion(topics) {
		const cond = {
			topicId: { $in: topics },
			pushed: false
		}
		return HotQuestionModel.update(cond, {
			pushed: true,
			updateTime: new Date()
		}, {
				multi: true
			})
	}
}
