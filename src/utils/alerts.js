import Swal from 'sweetalert2';

const brandColor = '#FF2F2F';
const darkColor = '#111111';

export const notifySuccess = (text, title = 'Thành công!') =>
  Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: brandColor,
  });

export const notifyError = (text, title = 'Thất bại!') =>
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: brandColor,
  });

export const notifyWarning = (text, title = 'Lưu ý') =>
  Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: brandColor,
  });

export const notifyInfo = (text, title = 'Thông báo') =>
  Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonColor: brandColor,
  });

export const confirmAction = async ({
  title = 'Bạn có chắc chắn?',
  text = 'Hành động này không thể hoàn tác.',
  confirmButtonText = 'Đồng ý',
  cancelButtonText = 'Hủy',
  icon = 'warning',
} = {}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: brandColor,
    cancelButtonColor: darkColor,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};

export const promptText = async ({
  title,
  inputLabel,
  inputPlaceholder = '',
  confirmButtonText = 'Xác nhận',
} = {}) => {
  const result = await Swal.fire({
    title,
    input: 'text',
    inputLabel,
    inputPlaceholder,
    showCancelButton: true,
    confirmButtonColor: brandColor,
    cancelButtonColor: darkColor,
    confirmButtonText,
    cancelButtonText: 'Hủy',
    inputValidator: (value) => (!value?.trim() ? 'Vui lòng nhập thông tin.' : undefined),
  });

  return result.isConfirmed ? result.value.trim() : '';
};
