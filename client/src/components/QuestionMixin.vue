<script>
export default {
  props: ['question'],
  methods: {
    stopCrawling (q, e) {
      e.stopPropagation()
      this.$api.stopCrawling(q.qid).then(rs => {
        q.status = 0
      })
    },
    addQuestion (q, e) {
      e.stopPropagation()
      this.$api.addQuestion(q).then(rs => {
        console.log(rs)
        q.status = 1
      }).catch(err => {
        console.log(err)
      })
    },
    reCrawling (q, e) {
      console.log('跟踪...')
      console.log(q)
      if (!q._id) return this.addQuestion(q, e)
      e.stopPropagation()
      this.$api.reCrawling(q.qid).then(rs => {
        q.status = 1
      })
    }
  }
}
</script>
