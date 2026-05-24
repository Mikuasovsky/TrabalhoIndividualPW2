import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Category from "../models/Category.js";
import Status from "../models/Status.js";
import Location from "../models/Location.js";
import Occurrence from "../models/Occurrence.js";
import OccurrenceStatusHistory from "../models/OccurrenceStatusHistory.js";
import OccurrencePriorityHistory from "../models/OccurrencePriorityHistory.js";
import Comment from "../models/Comment.js";
import CommentFlag from "../models/CommentFlag.js";
import OccurrencePhoto from "../models/OccurrencePhoto.js";

/* ============================
   USER → EMPLOYEE
============================ */
User.hasOne(Employee, { foreignKey: "user_id" });
Employee.belongsTo(User, { foreignKey: "user_id" });

/* ============================
   USER → OCCURRENCES
============================ */
User.hasMany(Occurrence, { foreignKey: "created_by" });
Occurrence.belongsTo(User, { foreignKey: "created_by" });

/* ============================
   USER → COMMENTS
============================ */
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

/* ============================
   OCCURRENCE → CATEGORY
============================ */
Category.hasMany(Occurrence, { foreignKey: "category_id" });
Occurrence.belongsTo(Category, { foreignKey: "category_id" });

/* ============================
   OCCURRENCE → STATUS (current)
============================ */
Status.hasMany(Occurrence, { foreignKey: "current_status_id" });
Occurrence.belongsTo(Status, { foreignKey: "current_status_id" });

/* ============================
   OCCURRENCE → LOCATION
============================ */
Location.hasMany(Occurrence, { foreignKey: "location_id" });
Occurrence.belongsTo(Location, { foreignKey: "location_id" });

/* ============================
   OCCURRENCE → PHOTOS
============================ */
Occurrence.hasMany(OccurrencePhoto, { foreignKey: "occurrence_id" });
OccurrencePhoto.belongsTo(Occurrence, { foreignKey: "occurrence_id" });

/* ============================
   OCCURRENCE → STATUS HISTORY
============================ */
Occurrence.hasMany(OccurrenceStatusHistory, { foreignKey: "occurrence_id" });
OccurrenceStatusHistory.belongsTo(Occurrence, { foreignKey: "occurrence_id" });

Status.hasMany(OccurrenceStatusHistory, { foreignKey: "status_id" });
OccurrenceStatusHistory.belongsTo(Status, { foreignKey: "status_id" });

/* ============================
   OCCURRENCE → PRIORITY HISTORY
============================ */
Occurrence.hasMany(OccurrencePriorityHistory, { foreignKey: "occurrence_id" });
OccurrencePriorityHistory.belongsTo(Occurrence, { foreignKey: "occurrence_id" });

/* ============================
   OCCURRENCE → COMMENTS
============================ */
Occurrence.hasMany(Comment, { foreignKey: "occurrence_id" });
Comment.belongsTo(Occurrence, { foreignKey: "occurrence_id" });

/* ============================
   COMMENT → COMMENT FLAGS
============================ */
Comment.hasMany(CommentFlag, { foreignKey: "comment_id" });
CommentFlag.belongsTo(Comment, { foreignKey: "comment_id" });

export {
  User,
  Employee,
  Category,
  Status,
  Location,
  Occurrence,
  OccurrenceStatusHistory,
  OccurrencePriorityHistory,
  Comment,
  CommentFlag,
  OccurrencePhoto,
};
