import { Anchor, Modal, Stack, Text, Title } from "@mantine/core";

type InfoModalProps = {
    onClose: () => void;
    open: boolean;
};

export default function InfoModal({ onClose, open }: InfoModalProps) {
    return (
        <Modal opened={open} onClose={onClose} title={
            <Title order={5}>Information</Title>
        }>
            <Stack>
                <Text variant="p">
                    This simple web app allows you to extract a color palette from an image using the <Anchor href="https://en.wikipedia.org/wiki/K-means_clustering" target="_blank"> K-means clustering</Anchor> algorithm.
                </Text>
                <Text variant="p">
                    The algorithm groups similar colors together and returns the most representative colors in the image. You can select the number of colors you want to be generated, as well as several other geeky options.
                </Text>
                <Text variant="p">
                    Because the algorithm starts with random colors as centroids, the result might vary slightly each time you run it. This is normal and expected. You might also notice that certain images take longer to process than others, despite you specifying the same settings.
                </Text>
                <Text variant="p">
                    The processing is done on your machine - no requests are made to remote servers, so feel free to experiment with the settings, but keep in mind it might become slow for large images or high settings!
                </Text>
            </Stack>
        </Modal>
    )
}