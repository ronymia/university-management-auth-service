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
const redis_1 = require("../../../shared/redis");
const academicFaculty_constant_1 = require("./academicFaculty.constant");
const academicFaculty_service_1 = require("./academicFaculty.service");
const initAcademicFaculty = () => __awaiter(void 0, void 0, void 0, function* () {
    // CREATE ACADEMIC FACULTY
    yield redis_1.RedisClient.subscribe(academicFaculty_constant_1.EVENT_ACADEMIC_FACULTY_CREATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield academicFaculty_service_1.AcademicFacultyService.createAcademicFacultyFromEvent(Object.assign(Object.assign({}, data), { syncId: data === null || data === void 0 ? void 0 : data.id }));
    }));
    // UPDATE ACADEMIC FACULTY
    yield redis_1.RedisClient.subscribe(academicFaculty_constant_1.EVENT_ACADEMIC_FACULTY_UPDATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield academicFaculty_service_1.AcademicFacultyService.updateAcademicFacultyFromEvent(Object.assign(Object.assign({}, data), { syncId: data === null || data === void 0 ? void 0 : data.id }));
    }));
    // DELETE ACADEMIC FACULTY
    yield redis_1.RedisClient.subscribe(academicFaculty_constant_1.EVENT_ACADEMIC_FACULTY_DELETED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield academicFaculty_service_1.AcademicFacultyService.deleteAcademicFacultyFromEvent(data.id);
    }));
});
// EXPORT EVENTS
exports.default = initAcademicFaculty;
