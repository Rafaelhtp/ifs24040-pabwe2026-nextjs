// SweetAlert2 dimuat lazy (hanya saat dialog benar-benar ditampilkan) supaya tidak
// ikut di bundle awal halaman login/register -> JS awal lebih kecil, Performance naik.
const loadSwal = async () => (await import("sweetalert2")).default;

export async function showSuccessDialog(message: string, title: string = "Berhasil") {
  const Swal = await loadSwal();
  return Swal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonColor: "#2563eb",
    confirmButtonText: "OK",
  });
}

export async function showErrorDialog(message: string, title: string = "Gagal") {
  const Swal = await loadSwal();
  return Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: "#dc2626",
    confirmButtonText: "Tutup",
  });
}

export async function showWarningDialog(message: string, title: string = "Peringatan") {
  const Swal = await loadSwal();
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
  const Swal = await loadSwal();
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