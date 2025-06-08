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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const academicDepartment_event_1 = __importDefault(require("../modules/academicDepartment/academicDepartment.event"));
const academicFaculty_event_1 = __importDefault(require("../modules/academicFaculty/academicFaculty.event"));
const academicSemester_event_1 = __importDefault(require("../modules/academicSemester/academicSemester.event"));
const subscribeToEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    // ACADEMIC SEMESTER
    yield (0, academicSemester_event_1.default)();
    // ACADEMIC FACULTY
    yield (0, academicFaculty_event_1.default)();
    // ACADEMIC DEPARTMENT
    yield (0, academicDepartment_event_1.default)();
});
exports.default = subscribeToEvents;
