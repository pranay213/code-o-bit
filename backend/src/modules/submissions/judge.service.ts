import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { IProblem } from '@/modules/problems/problem.model';
import { SUBMISSION_STATUS } from '@/constants/submission-status';

export interface TestCaseResult {
  status: string;
  executionTime: number;
  consoleOutput: string;
  expectedOutput?: string;
  actualOutput?: string;
  error?: string;
}

interface JudgeResult {
  status: string;
  executionTime: number;
  memoryUsed: number;
  errorMessage?: string;
  passedCases: number;
  totalCases: number;
  testcaseResults?: TestCaseResult[];
}

export const judgeService = {
  async evaluateSubmission(
    language: string,
    code: string,
    problem: IProblem
  ): Promise<JudgeResult> {
    const totalCases = problem.testCases?.length || 0;
    if (totalCases === 0) {
      return {
        status: SUBMISSION_STATUS.ACCEPTED,
        executionTime: 0,
        memoryUsed: 0,
        passedCases: 0,
        totalCases: 0
      };
    }

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-o-bit-'));
    let fileExt = '.txt';
    if (language === 'javascript') fileExt = '.js';
    else if (language === 'python') fileExt = '.py';
    else if (language === 'cpp') fileExt = '.cpp';

    const sourceFile = path.join(tempDir, `solution${fileExt}`);
    fs.writeFileSync(sourceFile, code);

    // Compile C++ if needed
    if (language === 'cpp') {
      try {
        await new Promise((resolve, reject) => {
          const compileProcess = spawn('g++', [sourceFile, '-o', path.join(tempDir, 'solution.out')]);
          let errStr = '';
          compileProcess.stderr.on('data', data => errStr += data.toString());
          compileProcess.on('close', code => {
            if (code === 0) resolve(true);
            else reject(new Error('Compilation Error: ' + errStr));
          });
        });
      } catch (err: any) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        return {
          status: SUBMISSION_STATUS.COMPILATION_ERROR,
          executionTime: 0,
          memoryUsed: 0,
          errorMessage: err.message,
          passedCases: 0,
          totalCases
        };
      }
    }

    let passedCases = 0;
    let maxExecutionTime = 0;
    let finalStatus: string = SUBMISSION_STATUS.ACCEPTED;
    let firstErrorMessage: string | undefined;
    const testcaseResults: TestCaseResult[] = [];

    for (let i = 0; i < totalCases; i++) {
      const testCase = problem.testCases[i];
      const result = await runTestCase(language, tempDir, testCase.input, problem.timeLimit);
      
      const tcResult: TestCaseResult = {
        status: result.status,
        executionTime: result.executionTime,
        consoleOutput: result.output,
        actualOutput: result.output.trim(),
      };
      if (testCase.isPublic) {
        tcResult.expectedOutput = testCase.expectedOutput.trim();
      }

      if (result.executionTime > maxExecutionTime) {
        maxExecutionTime = result.executionTime;
      }

      if (result.error) {
        finalStatus = result.status;
        firstErrorMessage = result.error;
        tcResult.error = result.error;
        tcResult.status = result.status;
        testcaseResults.push(tcResult);
        break; // Stop at first failed test case
      }

      // Compare output
      const expectedOutput = testCase.expectedOutput.trim();
      const actualOutput = result.output.trim();
      
      if (expectedOutput === actualOutput) {
        passedCases++;
        tcResult.status = SUBMISSION_STATUS.ACCEPTED;
      } else {
        finalStatus = SUBMISSION_STATUS.WRONG_ANSWER;
        firstErrorMessage = `Expected "${expectedOutput}" but got "${actualOutput}"`;
        tcResult.status = SUBMISSION_STATUS.WRONG_ANSWER;
        tcResult.error = firstErrorMessage;
        testcaseResults.push(tcResult);
        break;
      }
      testcaseResults.push(tcResult);
    }

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });

    return {
      status: finalStatus,
      executionTime: maxExecutionTime,
      memoryUsed: Math.floor(Math.random() * 20) + 10, // Mock memory for now as reading RSS is complex in Node
      errorMessage: firstErrorMessage,
      passedCases,
      totalCases,
      testcaseResults
    };
  }
};

async function runTestCase(
  language: string, 
  dir: string, 
  input: string, 
  timeoutMs: number
): Promise<{ output: string; error?: string; status: string; executionTime: number }> {
  return new Promise((resolve) => {
    let command = '';
    let args: string[] = [];

    if (language === 'javascript') {
      command = 'node';
      args = [path.join(dir, 'solution.js')];
    } else if (language === 'python') {
      command = 'python3';
      args = [path.join(dir, 'solution.py')];
    } else if (language === 'cpp') {
      command = path.join(dir, 'solution.out');
    }

    const startTime = Date.now();
    const child = spawn(command, args);

    let stdout = '';
    let stderr = '';

    // Handle timeout
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({ 
        output: stdout, 
        error: 'Time Limit Exceeded', 
        status: SUBMISSION_STATUS.TIME_LIMIT_EXCEEDED,
        executionTime: Date.now() - startTime 
      });
    }, timeoutMs);

    child.stdout.on('data', data => stdout += data.toString());
    child.stderr.on('data', data => stderr += data.toString());

    child.on('close', code => {
      clearTimeout(timeout);
      const executionTime = Date.now() - startTime;
      
      if (code !== 0 && code !== null) { // code null if killed by signal
        resolve({
          output: stdout,
          error: stderr || `Process exited with code ${code}`,
          status: SUBMISSION_STATUS.RUNTIME_ERROR,
          executionTime
        });
      } else {
        resolve({
          output: stdout,
          status: SUBMISSION_STATUS.ACCEPTED,
          executionTime
        });
      }
    });

    child.on('error', err => {
      clearTimeout(timeout);
      resolve({
        output: stdout,
        error: err.message,
        status: SUBMISSION_STATUS.RUNTIME_ERROR,
        executionTime: Date.now() - startTime
      });
    });

    // Write input to stdin
    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();
  });
}
