/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JudgeCase } from './JudgeCase';
import type { JudgeConfig } from './JudgeConfig';

export type QuestionEditRequest = {
    answer?: string;
    content?: string;
    countCode?: string;
    defaultCode?: string;
    helpCode?: string;
    id?: number;
    judgeCase?: Array<JudgeCase>;
    judgeConfig?: JudgeConfig;
    mode?: number;
    tags?: Array<string>;
    title?: string;
};
