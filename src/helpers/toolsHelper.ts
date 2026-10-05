import Swal from "sweetalert2";

export function showSuccessDialog(message: string, title: string = "Berhasil") {
  return Swal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonColor: "#2563eb",
    confirmButtonText: "OK",
  });
}

export function showErrorDialog(message: string, title: string = "Gagal") {
  return Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: "#dc2626",
    confirmButtonText: "Tutup",
  });
}

export function showWarningDialog(message: string, title: string = "Peringatan") {
  return Swal.fire({
    icon: "warning",
    title,
    text: message,
    confirmButtonColor: "#f59e0b",
    confirmButtonText: "OK",
  });
}

export async function showConfirmDialog(
  message: string,
  title: string = "Konfirmasi"
): Promise<boolean> {
  const result = await Swal.fire({
    icon: "question",
    title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Ya, Lanjutkan",
    cancelButtonText: "Batal",
  });

  return result.isConfirmed;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
