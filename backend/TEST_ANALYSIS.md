# Test Analysis Report

## Test Files Found
1. `listings/tests/test_recipe.py`
2. `conf/tests/test_models.py`
3. `conf/tests/test_admin.py`
4. `users/tests/test_user_api.py`

## Test Classes and Methods Breakdown

### 1. listings/tests/test_recipe.py
- **PublicListingsTest** (1 test method)
  - `test_auth_required`
  
- **PrivateListingsTest** (2 test methods)
  - `test_retrieving_list`
  - `test_retrieving_self_list`

**Subtotal: 2 classes, 3 test methods**

### 2. conf/tests/test_models.py
- **UserModelTest** (4 test methods)
  - `test_create_user`
  - `test_normalize_email`
  - `test_create_superuser`
  - `test_create_host`
  
- **ListingModelTest** (1 test method)
  - `test_create_recipes`

**Subtotal: 2 classes, 5 test methods**

### 3. conf/tests/test_admin.py
- **AdminSiteTests** (3 test methods)
  - `test_users_listed`
  - `test_user_change_page`
  - `test_user_add_page`

**Subtotal: 1 class, 3 test methods**

### 4. users/tests/test_user_api.py
- **PublicUserApiTests** (6 test methods)
  - `test_create_user_success`
  - `test_creation_with_same_email_returns_error`
  - `test_pswd_too_short`
  - `test_token_fetch`
  - `test_token_fetch_failure_on_no_pswd`
  - `test_retriving_self_not_allowed`
  
- **PrivateUserApiTests** (3 test methods)
  - `test_fetching_data`
  - `test_post_on_self_not_allowed`
  - `test_update_on_self`

**Subtotal: 2 classes, 9 test methods**

## Summary

| Metric | Count |
|--------|-------|
| **Total Test Files** | 4 |
| **Total Test Classes** | 7 |
| **Total Test Methods** | 20 |

## Test Distribution by App

| App | Test Classes | Test Methods |
|-----|-------------|--------------|
| `listings` | 2 | 3 |
| `conf` | 3 | 8 |
| `users` | 2 | 9 |

## Notes

- All test classes inherit from `django.test.TestCase`
- Django's test discovery should detect all 20 test methods across 7 test classes
- Test discovery follows Django's default pattern: `test*.py` files in `tests/` directories or files starting with `test_`
- All test files are properly located in `tests/` subdirectories

