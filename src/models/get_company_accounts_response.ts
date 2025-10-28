/*
 * Beans Stellar API License
 *
 * Copyright (c) 2025 Beans IP B.V. All rights reserved.
 *
 * This software is the sole property of Beans IP B.V. and is protected by intellectual property laws.
 * The user agrees to respect and protect the intellectual property rights of Beans IP B.V. and will not infringe upon them in any way.
 *
 * The use of this software is subject to a license agreement between the user and Beans IP B.V.
 * Users are not permitted to modify, distribute, or resell this software without prior written consent from Beans IP B.V.
 * This software may not be used for any illegal or unauthorized purposes.
 *
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS OF THIS SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 */

import { CompanyAccount } from './company_account';

export interface GetCompanyAccountsResponseDto {
    accounts: CompanyAccount[];
}

