import { Transform } from "class-transformer";

const optionalBooleanMapper = new Map<string | number | boolean, boolean>([
    ['true', true],
    ['false', false],
    ['1', true],
    ['0', false],
    [true, true],
    [false, false],
    [1, true],
    [0, false],
]);

export const ParseBoolean = () => {
    Transform(({ value }) => optionalBooleanMapper.get(value))
}