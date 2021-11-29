const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      default: "Large",
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

//get total count of commetns and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  //this is a virtual field that is not stored in the database but is calculated on the fly when the document is retrieved from the database
  //it will be available on the document as a property called commentCount and can be accessed using this.commentCount from the frontend code using the virtuals option in toJSON option
  // this.comments.length is the total number of comments on the pizza commentCount is from the comments array in the schema and is not stored in the database
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length,
    +1,
    0
  );
});

//create the Pizza model using the PizzaSchema we made
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
