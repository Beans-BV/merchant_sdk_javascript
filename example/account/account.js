 import { BeansMerchantSdk } from '../../dist/sdk.js';
        let currentSdk = null;
        let currentStellarAccountId = null;
        // Load existing Accounts
        async function loadSubaccounts() {
            const subaccountsList = document.getElementById('subaccountsList');
            if (!currentSdk) return;

            try {
                const accounts = await currentSdk.getMerchantAccounts();
                subaccountsList.innerHTML = accounts.map(account => `
                    <div class="account-card">
                        <div class="subaccount-info">
                            <img class="subaccount-avatar"
                                 src="${account.avatarId ? `data:image/jpeg;base64,${account.avatarId}` : 'https://via.placeholder.com/50'}" 
                                 alt="Avatar">
                            <div class="subaccount-details">
                                <div class="subaccount-name">${account.name.en || 'Unnamed Account'}</div>
                                <div class="subaccount-id">${account.stellarAccountId}</div>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm" onclick="deleteSubaccount('${account.stellarAccountId}')">
                            Delete
                        </button>
                    </div>
                `).join('');
            } catch (error) {
                subaccountsList.innerHTML = `
                    <div class="alert alert-danger">
                        Error loading Accounts: ${error.message}
                    </div>
                `;
            }
        }
        // Preview avatar image when selected
        document.getElementById('avatarFile').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('avatarPreview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    document.getElementById('previewPlaceholder').style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
        // Delete account function
        window.deleteSubaccount = async function(stellarAccountId) {
            if (!currentSdk) return;
            if (!confirm('Are you sure you want to delete this Account? This action cannot be undone.')) {
                return;
            }
            try {
                const deleteResponse = await currentSdk.deleteCompanyAccount(stellarAccountId);
                showAlert('success', 'Account deleted successfully!');
                await loadSubaccounts();
            } catch (error) {
                showAlert('danger', 'Error deleting Account: ' + error.message);
            }
        };
        // Handle form submission
        document.getElementById('createAccountForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            const apiKey = document.getElementById('apiKey').value;
            const stellarAccountId = document.getElementById('stellarAccountId').value;
            const nameEn = document.getElementById('nameEn').value;
            const nameVn = document.getElementById('nameVn').value;
            const avatarFile = document.getElementById('avatarFile').files[0];
            // Clear previous results
            document.getElementById('alertContainer').innerHTML = '';
            document.getElementById('jsonResponse').textContent = 'Processing...';
            document.getElementById('accountDetails').style.display = 'none';
            document.getElementById('deleteStatus').style.display = 'none';
            document.getElementById('deleteAccountBtn').disabled = false;
            document.getElementById('deleteAccountBtn').textContent = 'Delete Account';
            try {
                // Create SDK instance
                currentSdk = BeansMerchantSdk.staging(apiKey);
                currentStellarAccountId = stellarAccountId;
                // Create name object
                const name = { 'en': nameEn };
                if (nameVn) {
                    name['vn'] = nameVn;
                }
                // Create Account
                showAlert('info', 'Creating Account...');
                const response = await currentSdk.createCompanyAccount(stellarAccountId, name);
                // Display results
                document.getElementById('jsonResponse').textContent = JSON.stringify(response, null, 2);
                // Populate account details
                document.getElementById('resultAccountId').textContent = response.account.id;
                document.getElementById('resultCompanyId').textContent = response.account.companyId;
                document.getElementById('resultStellarAccountId').textContent = response.account.stellarAccountId;
                document.getElementById('resultNameEn').textContent = response.account.name.en || 'N/A';
                document.getElementById('resultNameVn').textContent = response.account.name.vi || 'N/A';
                document.getElementById('accountDetails').style.display = 'block';
                // Upload avatar if provided
                if (avatarFile) {
                    try {
                        showAlert('info', 'Uploading avatar...');
                        const updatedAccount = await currentSdk.uploadCompanyAccountAvatar('me', stellarAccountId, avatarFile);
                        // Update JSON response with updated account
                        document.getElementById('jsonResponse').textContent = JSON.stringify(updatedAccount, null, 2);
                        // Fetch and display avatar
                        if (updatedAccount.avatarId) {
                            showAlert('info', 'Fetching avatar...');
                            const avatarArrayBuffer = await currentSdk.getCompanyAccountAvatar('me', updatedAccount.id, updatedAccount.avatarId);
                            // Convert ArrayBuffer to Blob and create URL
                            const blob = new Blob([avatarArrayBuffer]);
                            const imageUrl = URL.createObjectURL(blob);
                            // Display avatar
                            document.getElementById('resultAvatar').src = imageUrl;
                            document.getElementById('avatarSection').style.display = 'block';
                        }
                        showAlert('success', 'Account created and avatar uploaded successfully!');
                    } catch (avatarError) {
                        console.error('Avatar upload error:', avatarError);
                        showAlert('warning', 'Account created, but avatar upload failed: ' + avatarError.message);
                    }
                } else {
                    showAlert('success', 'Account created successfully!');
                }

                // Reload Accounts list
                await loadSubaccounts();
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('jsonResponse').textContent = error.toString();
                showAlert('danger', 'Error: ' + error.message);
            }
        });
        // Helper function to show alerts
        function showAlert(type, message) {
            const alertContainer = document.getElementById('alertContainer');
            const alert = document.createElement('div');
            alert.className = `alert alert-${type} alert-dismissible fade show`;
            alert.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            alertContainer.appendChild(alert);
        }