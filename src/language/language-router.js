const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('./LinkedList')
const bodyParser = express.json();

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    // implement me
    try {
      const word = await LanguageService.getLanguageHead(
        req.app.get('db'),
        req.language.id,
        req.language.head
      )

      res.json({
        nextWord: word.original,
        totalScore: req.language.total_score,
        wordCorrectCount: word.correct_count,
        wordIncorrectCount: word.incorrect_count,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', bodyParser, async (req, res, next) => {
    // implement me

    const { guess } = req.body

    if(!guess)
      return res.status(400).json({
        error: `Missing 'guess' in request body`,
      })

    try {
      let words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )  

      let list = new LinkedList()
      list.populateList(words, req.language.head)

      let head = list.head.value
      let answer = head.translation === guess.toLowerCase()
      let score = req.language.total_score

      if (answer){
        head.memory_value*=2
        head.correct_count+=1
        score++
      } else {
        head.memory_value=1
        head.incorrect_count+=1
      }
      let data = list.moveHead(head.memory_value)

      // list.printList()
      await LanguageService.updateLanguage(
        req.app.get('db'),
        req.language.id,
        data.new_head_id,
        score
      )

      await LanguageService.updateWords(
        req.app.get('db'),
        head, 
        data
      )

      let word = await LanguageService.getLanguageHead(
        req.app.get('db'),
        req.language.id,
        data.new_head_id
      )

      res.json({
        answer: head.translation,
        isCorrect: answer,
        nextWord: word.original, // fix this
        totalScore: score, // fix this
        wordCorrectCount: word.correct_count,
        wordIncorrectCount: word.incorrect_count,
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter