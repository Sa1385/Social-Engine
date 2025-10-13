import { model, Schema } from 'mongoose';

const TagSchema = new Schema({ name: String }, { timestamps: true });

export default model('Tag', TagSchema);

