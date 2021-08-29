import mongoose from "mongoose"
const Schema = mongoose.Schema

const RateSchema = new Schema({
    userId: String,
    rateList: [
        {   
            rateTime: String,
            rate: {
                type: Number, 
                default: 4
            }
        }
    ]
})

const Rate = mongoose.model('Rate', RateSchema)

export default Rate
