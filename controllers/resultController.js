const Result = require("../models/Result");
const { handleError } = require("../utils/handleError");

const getResult = async (req,res)=>{
    const studentId = req.userId;

    try {
        const result = await Result.find({studentId});
        if(!result || result.length === 0){
            return res.status(404).json({status: "error", message: "No result found"});
        }
        console.log("Hello")
        return res.status(200).json({status: "success", data: result});
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getResult,
}