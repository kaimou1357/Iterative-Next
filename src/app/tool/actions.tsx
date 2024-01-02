'use server'
import * as esbuild from 'esbuild'
import { TransformResult, TransformOptions} from 'esbuild';
export async function convertCode<T extends TransformOptions>(code: string): Promise<TransformResult<T>> {
  return await esbuild.transform(`export default ${code}`, {
    loader: "jsx",
    target: "es2015",
    format: "iife",
    globalName: "MyApp",
  });
}