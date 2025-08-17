import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PriceManagement from "@/components/admin/PriceManagement";

const AdminPrices = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Helmet>
        <title>{t("admin.priceManagement.title")} - Surfskate Hall</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <PriceManagement />
    </div>
  );
};

export default AdminPrices;