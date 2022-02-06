import request from 'api/config/axiosUtils';

export const posts = request({ path: '/todos', config: { timeout: false } });

import { SYNC_API_URL } from 'lib/setting';

let path = SYNC_API_URL;

export const endPoints = {
  // user
  post_token: `${path}/launcher/api/user/refresh/token`,
  post_signin: `${path}/launcher/api/user/login`,
  post_logout: `${path}/launcher/api/user/logout`,
  post_auto_login: `${path}/launcher/api/user/autologin`,
  post_signup: `${path}/launcher/api/user/signup`,
  post_email_check: `${path}/launcher/api/user/email/check`,
  post_code_check: `${path}/launcher/api/user/email/check/random`,
  post_reset_email_check: `${path}/launcher/api/user/email/check/password`,
  post_password_reset: `${path}/launcher/api/user/password/reset`,
  post_password_change: `${path}/launcher/api/user/password/change`,
  // my
  post_get_user_info: `${path}/launcher/api/my/information`,
  post_user_info_update: `${path}/launcher/api/my/information/update`,
  post_message_partner_update: `${path}/launcher/api/my/message/partner/update`,
  // post_user_partner: `${path}/launcher/api/my/partner/default`,
  // post_message_list: `${path}/launcher/api/my/message/list`,
  // post_message_delete_all: `${path}/launcher/api/my/message/delete/all`,
  post_message_delete: `${path}/launcher/api/my/message/delete`,
  post_message_read: `${path}/launcher/api/my/message/read`,
  post_default_partner_update: `${path}/launcher/api/my/partner/update`,
  post_partner_delete: `${path}/launcher/api/my/partner/delete`,
  post_get_partner_list: `${path}/launcher/api/my/partner/list`,
  post_get_partner_search_list: `${path}/launcher/api/my/partner/search`,
  post_get_partner_wait_list: `${path}/launcher/api/my/partner/wait`,
  post_get_partner: `${path}/launcher/api/my/partner/information`,
  post_partner_update_create: `${path}/launcher/api/my/partner/add`,
  post_partner_update_cancel: `${path}/launcher/api/my/partner/cancel`,
  post_base_option_info: `${path}/launcher/api/my/option/info`,
  post_base_option_update: `${path}/launcher/api/my/option/apply`,
  post_base_workspace_select: `${path}/launcher/api/my/workspace/select`,
  post_base_workspace_delete: `${path}/launcher/api/my/workspace/delete`,
  // case, works, project (===, 신규는 project로)
  post_project_create_save: `${path}/launcher/api/case/create/new`,
  post_project_file_local_upload: `${path}/launcher/api/case/local/upload`,
  // post_case_load_list: `${path}/launcher/api/case/load/list`,
  // post_case_sync: `${path}/launcher/api/case/sync`,
  // post_works_list: `${path}/launcher/api/works/list`,
  post_project_partner_memo_update: `${path}/launcher/api/works/memo/update`,
  post_get_project_list: `${path}/launcher/api/project/list`,
  post_project_copy: `${path}/launcher/api/project/copy`,
  post_project_hide: `${path}/launcher/api/project/hide`,
  post_project_delete: `${path}/launcher/api/project/delete`,
  post_project_load_detail: `${path}/launcher/api/project/load/detail`,
  post_project_new_init: `${path}/launcher/api/project/new/init`,
  // bin/file
  post_pulling_upload: `${path}/launcher/bin/file/dashboard`, // component에서 사용
  post_folder_open: `${path}/launcher/bin/file/open`,
  post_local_file_upload: `${path}/launcher/bin/file/case/upload`,
  post_cloud_file_delete: `${path}/launcher/bin/file/delete`,
  post_cloud_file_download: `${path}/launcher/bin/file/download`,
  post_get_local_file_list: `${path}/launcher/bin/file/locallist`,
  post_get_cloud_file_list: `${path}/launcher/bin/file/list`,
  // post_change_profile: `${path}/launcher/bin/file/profile/upload`,
  // post_upload_shortcut_exe: `${path}/launcher/bin/file/application`,
  // teeth
  post_base_BASE_INDICATION_FORMAT: `${path}/launcher/api/teeth/indication/format`,
  // store
  post_get_license_load_data: `${path}/launcher/api/store/license/load`,
  post_get_store_product_list: `${path}/launcher/api/store/product/list`,
  post_get_purchase_product_list: `${path}/launcher/api/store/purchase/history`,
  post_get_order_history: `${path}/launcher/api/store/order/history`,
  post_get_purchase_free: `${path}/launcher/api/store/purchase/free`,
  post_purchase: `${path}/launcher/api/store/purchase`,
  post_purchase_complete: `${path}/launcher/api/store/purchase/complete`,
  post_purchase_fail: `${path}/launcher/api/store/purchase/fail`,
  post_serial_register: `${path}/launcher/api/store/serial/register`,
  post_get_serial_info: `${path}/launcher/api/store/serial/info`,
  post_serial_delete: `${path}/launcher/api/store/serial/delete`,
  // dashboard
  post_get_dashboard_list: `${path}/launcher/api/dashboard`,
  post_get_dashboard_partner_list: `${path}/launcher/api/dashboard/partner`,
  // etc
  post_get_country_list: `${path}/launcher/api/country/list`,
  post_get_location_list: val => `${path}/launcher/api/country/region/list?country=${val}`,
  post_get_sync_login_init: `${path}/launcher/api/sync/init`,
  post_help_question: `${path}/launcher/api/question`,
  get_question_type_list: `${path}/launcher/api/question/type`,
  post_exe_nav_submit: `${path}/launcher/api/run/app`,
  // none
  post_error_meesage: `${path}/launcher/api/error`,
};
