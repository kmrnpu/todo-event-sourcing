import { z, ZodError, ZodObject, ZodRawShape, ZodTypeAny } from "zod";
import { Result, ok, err } from "neverthrow";

export type Phantomic<T, Tag extends string> = T & {
  [key in `__PT__${Tag}`]: never;
};

export const parseWithResult =
  <Schema extends ZodTypeAny>(schema: Schema) =>
  (input: z.input<Schema>): Result<z.infer<Schema>, ZodError> => {
    const result = schema.safeParse(input);
    return result.success ? ok(result.data) : err(result.error);
  };

export const parse =
  <Schema extends ZodTypeAny>(schema: Schema) =>
  (input: z.input<Schema>): z.infer<Schema> => {
    const result = schema.parse(input);
    return result;
  };

export const _branded = <Tag extends string, S extends ZodTypeAny>(
  _: Tag,
  schema: S,
) => schema.transform((v) => v as Phantomic<z.infer<S>, Tag>);

export const branded = <Tag extends string, S extends ZodTypeAny>(
  _: Tag,
  schema: S,
): [
  schema: z.ZodEffects<S, Phantomic<z.TypeOf<S>, Tag>, z.input<S>>,
  factory: (value: z.input<S>) => Result<Phantomic<z.infer<S>, Tag>, ZodError>,
] => {
  const s = schema.transform((v) => v as Phantomic<z.infer<S>, Tag>);
  return [s, parseWithResult(s)] as const;
};

export const normalizeedEventSchema = <
  T extends ZodRawShape,
  K extends keyof T,
>(
  schema: ZodObject<T>,
  key: K,
) => {
  const shape = schema.shape[key];
  return z.object({
    type: z.literal(key),
    payload: shape,
  });
};
