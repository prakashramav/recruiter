const Recruiter = require("../models/recruiterModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const recruiterRegister = async (req, res) => {
    try {
    const { name, email, password, companyName, companyWebsite, designation } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password are required' });

    const existing = await Recruiter.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Recruiter already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const recruiter = new Recruiter({
      name,
      email,
      password: hashed,
      companyName,
      companyWebsite,
      designation
    });
    await recruiter.save();

    
    const rc = recruiter.toObject();
    delete rc.password;

    res.status(201).json({ message: 'Recruiter registered', recruiter: rc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const recruiterLogin = async (req, res) => {
    
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        const recruiter = await Recruiter.findOne({ email });
        if(!recruiter){
            return res.status(400).json({ msg: "User Not Register" });
        }
        const isMatch = await bcrypt.compare(password, recruiter.password);
        if(!isMatch){
            return res.status(400).json({ msg: "Password Not Valid" });
        }
        const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        res.status(200).json({ token });
    }catch(err){
        console.error(err);
        res.status(500).json({ msg: "Server error" });
        }
}

const getMyProfile = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.recruiter.id).select('-password');
        if (!recruiter) {
            return res.status(404).json({ msg: 'Recruiter not found' });
        }
        res.status(200).json(recruiter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};




module.exports = { recruiterRegister, recruiterLogin ,getMyProfile};
