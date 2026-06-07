// Importação de todos os modelos para definir as relações
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
   USER → EMPLOYEE (1:1)
   Um utilizador pode ter um registo de funcionário
============================ */
User.hasOne(Employee, { foreignKey: "user_id" });
Employee.belongsTo(User, { foreignKey: "user_id" });

/* ============================
   USER → OCCURRENCES (1:N)
   Um utilizador pode criar muitas ocorrências
============================ */
User.hasMany(Occurrence, { foreignKey: "created_by" });
Occurrence.belongsTo(User, { foreignKey: "created_by" });

/* ============================
   USER → COMMENTS (1:N)
   Um utilizador pode fazer muitos comentários
============================ */
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

/* ============================
   OCCURRENCE → CATEGORY (N:1)
   Uma ocorrência pertence a uma categoria
============================ */
Category.hasMany(Occurrence, { foreignKey: "category_id" });
Occurrence.belongsTo(Category, { foreignKey: "category_id" });

/* ============================
   OCCURRENCE → STATUS (N:1)
   Uma ocorrência tem um status atual
============================ */
Status.hasMany(Occurrence, { foreignKey: "current_status_id" });
Occurrence.belongsTo(Status, { foreignKey: "current_status_id" });

/* ============================
   OCCURRENCE → LOCATION (N:1)
   Uma ocorrência ocorre num local
============================ */
Location.hasMany(Occurrence, { foreignKey: "location_id" });
Occurrence.belongsTo(Location, { foreignKey: "location_id" });

/* ============================
   OCCURRENCE → PHOTOS (1:N)
   Uma ocorrência pode ter muitas fotos
============================ */
Occurrence.hasMany(OccurrencePhoto, { foreignKey: "occurrence_id" });
OccurrencePhoto.belongsTo(Occurrence, { foreignKey: "occurrence_id" });

/* ============================
   OCCURRENCE → STATUS HISTORY (1:N)
   Uma ocorrência tem um histórico de mudanças de status
============================ */
Occurrence.hasMany(OccurrenceStatusHistory, { foreignKey: "occurrence_id" });
OccurrenceStatusHistory.belongsTo(Occurrence, { foreignKey: "occurrence_id" });

Status.hasMany(OccurrenceStatusHistory, { foreignKey: "status_id" });
OccurrenceStatusHistory.belongsTo(Status, { foreignKey: "status_id" });

/* ============================
   OCCURRENCE → PRIORITY HISTORY (1:N)
   Uma ocorrência tem um histórico de mudanças de prioridade
============================ */
Occurrence.hasMany(OccurrencePriorityHistory, { foreignKey: "occurrence_id" });
OccurrencePriorityHistory.belongsTo(Occurrence, { foreignKey: "occurrence_id" });

/* ============================
   OCCURRENCE → COMMENTS (1:N)
   Uma ocorrência pode ter muitos comentários
============================ */
Occurrence.hasMany(Comment, { foreignKey: "occurrence_id" });
Comment.belongsTo(Occurrence, { foreignKey: "occurrence_id" });

/* ============================
   COMMENT → COMMENT FLAGS (1:N)
   Um comentário pode ter muitas sinalizações
============================ */
Comment.hasMany(CommentFlag, { foreignKey: "comment_id" });
CommentFlag.belongsTo(Comment, { foreignKey: "comment_id" });

// Exportação de todos os modelos para uso noutros ficheiros
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
