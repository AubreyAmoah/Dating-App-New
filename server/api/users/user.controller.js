const path = require('path');
const User  = require('../../model/User');
const BioData = require('../../model/Biodata')
const Video = require('../../model/Video');
const { genSaltSync, hashSync, compareSync} = require('bcrypt-nodejs');
const { sign, verify } = require('jsonwebtoken');
const dotenv = require('dotenv');
const Token = require('../../model/Token');

dotenv.config({ path: './.env'});

module.exports = {
    userRegister : async (req, res) => {
        let {email, first_name, last_name, gender, dob, university, level, password, repeat_password} = req.body;

        // Validate user input 

        if (!email){
            return res.status(400).json({data:'email field is empty'});
        }

        if (!first_name){
            return res.status(400).json({data:'fname field is empty'});
        }

        if (!last_name){
            return res.status(400).json({data:'lname field is empty'});
        }

        if (!gender){
            return res.status(400).json({data:'gender field is empty'});
        }

        if (!dob){
            return res.status(400).json({data:'dob field is empty'});
        }

        if (!university){
            return res.status(400).json({data:'university field is empty'});
        }

        if (!level){
            return res.status(400).json({data:'level field is empty'});
        }

        if (!password){
            return res.status(400).json({data:'password field is empty'});
        }

        if (!repeat_password){
            return res.status(400).json({data:'repeat password field is empty'});
        }

        if (!(password == repeat_password)){
            return res.status(400).json({data:'passwords do not match'});
        }

        const oldUser = await User.findOne({ email });

        if(oldUser) {
            return res.status(400).json({data:'user already Exists'});
        }


        const salt = genSaltSync(10);
        password = hashSync(password, salt);

        const defaultIcon = gender === "male" || "Male" || "MALE" ? "localhost:5000/man.png" : "localhost:5000/woman.png"

        const user = await User.create({
            first_name,
            last_name,
            email,
            gender,
            university,
            level,
            dob,
            profile_pic: defaultIcon,
            pending: [],
            matches: [],
            password: password
        })

        const owner = await BioData.findOne({ user });

        if (owner == user._id) {
            await BioData.findOneAndDelete({user})
        }

        await BioData.create({
            images: [],
            campus: [],
            interest: [],
            description: "",
            user: user._id
        });

        return res.status(200).json({
            success: 1,
            message: 'Registeration successful',
            data: user
        });
    },
    userLogin : async (req, res) => {
        const body = req.body;
        let email = body.email;

        const user = await User.findOne({ email });



        if (user) {
            console.log(user.password);
            const result = compareSync(body.password, user.password);


            if (result) {
                user.password = undefined;
                const token = sign({ result: user },
                    process.env.ACCESS_TOKEN_SECRET,{
                        expiresIn: '1d'
                    }    
                );

                const refreshToken = sign({ result: user },
                    process.env.REFRESH_TOKEN_SECRET,{
                        expiresIn: '24d'
                    }    
                );

                Token.create({ token: refreshToken, user: user._id })
                .then( result => {

                    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite:'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
                    return res.status(200).json({
                        success: 1,
                        message: 'Authentication Succesfull',
                        token: token
                    })
                })
                .catch(err => {
                    return res.status(400).json({
                        success: 1,
                        data: err
                    })
                });
            } else {
                return res.status(401).json({
                    success: 1,
                    data: `Invalid Credentials`
                })
            }
        } else {
            return res.status(401).json({
                success: 0,
                data: `Invalid Credentialss`
            })
        }
    },
    createInterest: async(req, res) => {
        const { _id } = req.decoded.result;
        const { interest_1, interest_2, interest_3, interest_4, interest_5, interest_6, interest_7, interest_8, interest_9, interest_10, interest_11, interest_12 } = req.body

        let interestArray = [];

        if ( interest_1 || interest_2 || interest_3 || interest_4 || interest_5 || interest_6 || interest_7 || interest_8 || interest_9 || interest_11 || interest_10 || interest_11 || interest_12) {
            
            if ( interest_1 != "" || undefined) {
                interestArray.push(interest_1)
            }

            if ( interest_2 != "" || undefined) {
                interestArray.push(interest_2)
            }

            if ( interest_3 != "" || undefined) {
                interestArray.push(interest_3)
            }

            if ( interest_4 != "" || undefined) {
                interestArray.push(interest_4)
            }

            if ( interest_5 != "" || undefined) {
                interestArray.push(interest_5)
            }

            if ( interest_6 != "" || undefined) {
                interestArray.push(interest_6)
            }

            if ( interest_7 != "" || undefined) {
                interestArray.push(interest_7)
            }

            if ( interest_8 != "" || undefined) {
                interestArray.push(interest_8)
            }

            if ( interest_9 != "" || undefined) {
                interestArray.push(interest_9)
            }

            if ( interest_10 != "" || undefined) {
                interestArray.push(interest_10)
            }

            if ( interest_11 != "" || undefined) {
                interestArray.push(interest_11)
            }

            if ( interest_12 != "" || undefined) {
                interestArray.push(interest_12)
            }
            
            console.log(interestArray);

            const user = await User.findOne({ _id });
    
            const bioData = await BioData.findOne({ user });

            bioData.interest = [];

            await bioData.save();
  
            for(let i = 0; i < interestArray.length; i++){
              console.log(interestArray[i])
              bioData.interest.push(interestArray[i])
            }
  
            await bioData.save();
  
            return res.status(200).json(bioData);

        } else {
            return res.status(401).json({
                success: 0,
                data: `Select at least one interest`
            })
        }
    },
    submitCampus: async(req, res) => {
        const { _id } = req.decoded.result;
        const { campus_1, campus_2, campus_3, campus_4 } = req.body

        let campusArray = [];

        if ( campus_1 || campus_2 || campus_3 || campus_4) {
            
            if ( campus_1 != "" || undefined) {
                campusArray.push(campus_1)
            }

            if ( campus_2 != "" || undefined) {
                campusArray.push(campus_2)
            }

            if ( campus_3 != "" || undefined) {
                campusArray.push(campus_3)
            }

            if ( campus_4 != "" || undefined) {
                campusArray.push(campus_4)
            }

            const user = await User.findOne({ _id });
    
            const bioData = await BioData.findOne({ user });

            bioData.campus = [];

            await bioData.save();
  
            for(let i = 0; i < campusArray.length; i++){
              console.log(campusArray[i])
              bioData.campus.push(campusArray[i])
            }
  
            await bioData.save();
  
            return res.status(200).json(bioData);

        } else {
            return res.status(401).json({
                success: 0,
                data: `Select at least one campus`
            })
        }
    },
    submitLevelPreference: async(req, res) => {
        const { _id } = req.decoded.result;
        const { level_1, level_2, level_3, level_4 } = req.body

        let levelArray = [];

        if ( level_1 || level_2 || level_3 || level_4) {
            
            if ( level_1 != "" || undefined) {
                levelArray.push(level_1)
            }

            if ( level_2 != "" || undefined) {
                levelArray.push(level_2)
            }

            if ( level_3 != "" || undefined) {
                levelArray.push(level_3)
            }

            if ( level_4 != "" || undefined) {
                levelArray.push(level_4)
            }

            const user = await User.findOne({ _id });
    
            const bioData = await BioData.findOne({ user });

            bioData.level_interest = [];

            await bioData.save();
  
            for(let i = 0; i < levelArray.length; i++){
              console.log(levelArray[i])
              bioData.level_interest.push(levelArray[i])
            }
  
            await bioData.save();
  
            return res.status(200).json(bioData);

        } else {
            return res.status(401).json({
                success: 0,
                data: `Select at least one level`
            })
        }
    },
    submitGenderPreference: async(req, res) => {
        const { _id } = req.decoded.result;
        const { gender_1, gender_2 } = req.body

        let genderArray = [];

        if ( gender_1 || gender_2 || gender_3 || gender_4) {
            
            if ( gender_1 != "" || undefined) {
               genderArray.push(gender_1)
            }

            if ( gender_2 != "" || undefined) {
               genderArray.push(gender_2)
            }

            const user = await User.findOne({ _id });
    
            const bioData = await BioData.findOne({ user });

            bioData.gender_interest = [];

            await bioData.save();
  
            for(let i = 0; i < genderArray.length; i++){
              console.log(genderArray[i])
              bioData.gender_interest.push(genderArray[i])
            }
  
            await bioData.save();
  
            return res.status(200).json(bioData);

        } else {
            return res.status(401).json({
                success: 0,
                data: `Select at least one gender`
            })
        }
    },
    submitDescription: async(req, res) => {
        const { _id } = req.decoded.result;
        const { description } = req.body

        if ( description ) {

            const user = await User.findOne({ _id });
    
            const bioData = await BioData.findOne({ user });

            bioData.description = description;
  
            await bioData.save();
  
            return res.status(200).json(bioData);

        } else {
            return res.status(401).json({
                success: 0,
                data: `Tell us something about yourself`
            })
        }
    },
    handleRefreshTokens: async (req, res) => {
        const cookies = req.cookies;

        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;

        const compareRefreshToken = await Token.findOne({ token: refreshToken });


        if (compareRefreshToken) {
            verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err ||  !(compareRefreshToken.user.equals(decoded.result._id))) {
                    return res.sendStatus(401);
                } else {
                    const accessToken = sign(
                        { 'email': decoded.result.email },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: '1d'}
                   );
                   return res.json({ accessToken });
                }
            })
        }
    },
    userLogout : async (req, res) => {
        const cookies = req.cookies;

        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;

        const compareRefreshToken = await Token.findOne({ token: refreshToken });

        if (compareRefreshToken) {
            Token.findOneAndDelete({ token: refreshToken })
            .then ( result => {
                res.clearCookie('jwt', { httpOnly: true , sameSite:'None', secure: true}); // secure: true on production
                res.json({
                    success: 1,
                    data: 'Logout succesful'
                });
            })
            .catch (err =>{
                res.json({
                    success: 0,
                    data: err
                });
            })
        } else {
            res.clearCookie('jwt', { httpOnly: true , sameSite:'None', secure: true });
            res.sendStatus(201).json({
                success: 0,
                data: 'Token not found'
            });
        }
    },
    submitImages : async (req, res) => {
        const link = 'http://localhost:5000'
        const { _id } = req.decoded.result;
        const user = await User.findOne({ _id });

        const imagesArray = []
    
        const bioData = await BioData.findOne({ user });
        let image_1;
        let image_2;
        let image_3;
        let image_4;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json('No files were uploaded.');
        }

        image_1 = req.files.image_1
        if(image_1){
            uploadPath = `${__dirname}/../../files/images/${_id}/${image_1.name}`;
            imageLink = `${link}/${_id}/images/${image_1.name}`

            imagesArray.push(imageLink);
    
            image_1.mv(uploadPath, err => {
                if (err){
                    return res.status(500).json(err);
                }
            })
        } else {
            return res.status(400).json({
                message : 'Image needed'
            })
        }

        image_2 = req.files.image_2
        if(image_2){
            uploadPath = `${__dirname}/../../files/images/${_id}/${image_2.name}`;
            imageLink = `${link}/${_id}/images/${image_2.name}`;

            imagesArray.push(imageLink);
    
            image_2.mv(uploadPath, err => {
                if (err){
                    return res.status(500).json(err);
                }
            })
        } else {
            return res.status(400).json({
                message : 'Image needed'
            })
        }

        image_3 = req.files.image_3
        if(image_3){
            uploadPath = `${__dirname}/../../files/images/${_id}/${image_3.name}`;
            imageLink = `${link}/${_id}/images/${image_3.name}`

            imagesArray.push(imageLink);
    
            image_3.mv(uploadPath, err => {
                if (err){
                    return res.status(500).json(err);
                }
            })
        } else {
            return res.status(400).json({
                message : 'Image needed'
            })
        }

        image_4 = req.files.image_4
        if(image_4){
            uploadPath = `${__dirname}/../../files/images/${_id}/${image_4.name}`;
            imageLink = `${link}/${_id}/images/${image_4.name}`

            imagesArray.push(imageLink);

            image_4.mv(uploadPath, err => {
                if (err){
                    return res.status(500).json(err);
                }
            })
        } else {
            return res.status(400).json({
                message : 'Image needed'
            })
        }

        bioData.images = [];

        await bioData.save();

        for(let i = 0; i < imagesArray.length; i++){
          bioData.images.push(imagesArray[i])
        }

        await bioData.save();

        return res.status(200).json(bioData);
    },
    updateImages : async (req, res) => {
        const link = 'http://localhost:5000'
        const { _id } = req.decoded.result;
        const user = await User.findOne({ _id });
    
        const bioData = await BioData.findOne({ user });
        let image_1;
        let image_2;
        let image_3;
        let image_4;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json('No files were uploaded.');
        }

        image_1 = req.files.image_1
        if(image_1){
            uploadPath = `${__dirname}/../../files/images/${_id}/${image_1.name}`;
            imageLink = `${link}/${_id}/images/${image_1.name}`

            bioData.images[0] = imageLink
    
            image_1.mv(uploadPath, err => {
                if (err){
                    return res.status(500).json(err);
                }
            })
        }

        image_2 = req.files.image_2
        if(image_2){
            uploadPath = `${__dirname}/../../files/images/${_id}/${image_2.name}`;
            imageLink = `${link}/${_id}/images/${image_2.name}`;

            bioData.images[1] = imageLink
    
            image_2.mv(uploadPath, err => {
                if (err){
                    return res.status(500).json(err);
                }
            })
        }

        image_3 = req.files.image_3
        if(image_3){
            uploadPath = `${__dirname}/../../files/images/${_id}/${image_3.name}`;
            imageLink = `${link}/${_id}/images/${image_3.name}`

            bioData.images[2] = imageLink
    
            image_3.mv(uploadPath, err => {
                if (err){
                    return res.status(500).json(err);
                }
            })
        }

        image_4 = req.files.image_4
        if(image_4){
            uploadPath = `${__dirname}/../../files/images/${_id}/${image_4.name}`;
            imageLink = `${link}/${_id}/images/${image_4.name}`

            bioData.images[3] = imageLink

            image_4.mv(uploadPath, err => {
                if (err){
                    return res.status(500).json(err);
                }
            })
        }

        await bioData.save();

        return res.status(200).json(bioData);
    },
    updateAvatar : async (req, res) => {
        const link = 'http://localhost:5000'
        const { _id } = req.decoded.result;
        const user = await User.findOne({ _id });
    
        let avatar;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json('No files were uploaded.');
        }

        avatar = req.files.avatar
        if(avatar){
            uploadPath = `${__dirname}/../../files/${_id}/avatar/${avatar.name}`;
            imageLink = `${link}/${_id}/avatar/${avatar.name}`

            user.profile_pic = imageLink
    
            avatar.mv(uploadPath, err => {
                if (err){
                    return res.status(500).json(err);
                }
            })
        } else {
            return res.status(400).json({
                message : 'Image needed'
            })
        }

        await user.save();

        return res.status(200).json(user);
    },
    createVideo : async (req, res) => {},
}