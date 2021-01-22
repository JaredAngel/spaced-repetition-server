const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
      .orderBy('id')
  },

  getLanguageHead(db, language_id, head_id){
    return db 
      .from('word')
      .select('*')
      .where(
        'id', '=', head_id, 
        'language_id', '=', language_id
      )
      .first()
  },

  updateLanguage(db, language_id, head_id, score){
    return db
      .from('language')
      .update({
        'head': head_id,
        'total_score': score 
      })
      .where('id', language_id)
  },

  updateWords(db, head, data){
    db.transaction(async function(t){
      try {
        await t('word')
          .where('id', head.id)
          .update({
            'memory_value': head.memory_value,
            'correct_count': head.correct_count,
            'incorrect_count': head.incorrect_count,
            'next': head.next
          })
          await t('word')
          .where('id', data.updated_node.id)
          .update({
            'next': data.updated_node.next
          })
      } catch(e){
        console.log(e)
        throw e
      }
    })
  },
}
module.exports = LanguageService