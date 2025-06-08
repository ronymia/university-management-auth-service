"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../enums/user");
const user_model_1 = require("../modules/user/user.model");
const seedDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // super admin
    const superAdminData = {
        id: user_1.ENUM_USER_ROLE.SUPER_ADMIN,
        role: user_1.ENUM_USER_ROLE.SUPER_ADMIN,
        password: '123456',
        needsChangePassword: false,
    };
    // check super admin
    const getSuperAdmin = yield user_model_1.User.findOne({ id: superAdminData.id });
    // create super admin
    if (!getSuperAdmin) {
        yield user_model_1.User.create(superAdminData);
    }
});
exports.default = seedDB;
