import {
	ImagePreviewGallery,
	type ImagePayload,
} from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import { sectionTitleClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/utils/styles";

type EvidenceInformationSectionProps = {
	images: ImagePayload[];
};

export function EvidenceInformationSection({
	images,
}: EvidenceInformationSectionProps) {
	if (images.length === 0) return null;

	return (
		<section className="flex flex-col gap-3 p-1">
			<h4 className={sectionTitleClassName}>Evidencias de recepción</h4>
			<ImagePreviewGallery
				images={images}
				title=""
				imageAlt="Evidencia de recepción"
			/>
		</section>
	);
}
