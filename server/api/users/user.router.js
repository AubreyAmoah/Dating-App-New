const { userRegister, createVideo, userLogin, handleRefreshTokens, userLogout, createInterest, submitCampus, submitLevelPreference, submitGenderPreference, submitDescription, submitImages, updateImages, updateAvatar } = require('./user.controller');
const fileUpload = require('express-fileupload');

const filesPayloadExists = require('../../middleware/filesPayloadExists');
const filesExtLimiter = require('../../middleware/fileExtLimiter');
const filesSizeLimiter = require('../../middleware/fileSizeLimiter');
const {checkToken} = require('../../middleware/validate_token');

const router = require('express').Router();

router.post('/signup', userRegister);
router.post('/login', userLogin);
router.post('/upload/interest', checkToken, createInterest);
router.post('/upload/campus', checkToken, submitCampus);
router.post('/upload/level-preference', checkToken, submitLevelPreference);
router.post('/upload/gender-preference', checkToken, submitGenderPreference);
router.post('/upload/description', checkToken, submitDescription);

router.get('/refresh', handleRefreshTokens);
router.get('/logout', userLogout);

router.post('/upload/images', checkToken, fileUpload({ createParentPath: true}), filesExtLimiter(['.jpg', '.jpeg', '.png', '.pdf']), filesSizeLimiter, submitImages);
router.post('/update/images', checkToken, fileUpload({ createParentPath: true}), filesExtLimiter(['.jpg', '.jpeg', '.png', '.pdf']), filesSizeLimiter, updateImages);
router.post('/update/avatar', checkToken, fileUpload({ createParentPath: true}), filesExtLimiter(['.jpg', '.jpeg', '.png', '.pdf']), filesSizeLimiter, updateAvatar);
router.post('/create/video/:chapter_id', fileUpload({ createParentPath: true }), filesPayloadExists, filesExtLimiter(['.mp4','.mkv']), filesSizeLimiter, createVideo);

module.exports = router;