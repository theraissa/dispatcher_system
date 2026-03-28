import { Box, Title, Center, Container } from '@mantine/core';

type NavbarProps = {
    title: string;
}

export default function NavbarTemplate({ title }: NavbarProps) {
    return (
        <Box
            component="header"
            bg="#213555"
            h={70}
            shadow="sm"
        >
            <Container h="100%" size="xl">
                <Center h="100%">
                    <Title
                        order={1}
                        c="white"
                        size="h2"
                        fw={700}
                        style={{ letterSpacing: '1px' }}
                    >
                        {title}
                    </Title>
                </Center>
            </Container>
        </Box>
    );
}
