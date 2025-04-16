import { notFound } from "next/navigation";

async function getTherapist(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/therapist/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.therapist;
}

const PrintQRCodePage = async ({ params }: { params: { id: string } }) => {
  const therapist = await getTherapist(params.id);

  if (!therapist) return notFound();

  return (
    <html>
      <head>
        <title>Print QR Code</title>
        <script>{`window.onload = function() { window.print(); }`}</script>
        <style>
          {`
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            img {
              width: 300px;
              height: 300px;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 24px;
              font-weight: bold;
            }
          `}
        </style>
      </head>
      <body>
        <img src={`/qrcode/${therapist.qrCodeUrl}`} alt="QR Code" />
        <h1>{therapist.name}</h1>
      </body>
    </html>
  );
};

export default PrintQRCodePage;
