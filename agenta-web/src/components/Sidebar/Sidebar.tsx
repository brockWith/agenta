import React, {useEffect, useState} from "react"
import {useRouter} from "next/router"
import {
    ApartmentOutlined,
    AppstoreOutlined,
    CloudUploadOutlined,
    DatabaseOutlined,
    LineChartOutlined,
    PhoneOutlined,
    QuestionOutlined,
    RocketOutlined,
    SettingOutlined,
} from "@ant-design/icons"
import {Avatar, Layout, Menu, Space, theme, Tooltip} from "antd"

import Logo from "../Logo/Logo"
import Link from "next/link"
import {useAppTheme} from "../Layout/ThemeContextProvider"
import {ErrorBoundary} from "react-error-boundary"
import {createUseStyles} from "react-jss"
import AlertPopup from "../AlertPopup/AlertPopup"
import {useProfileData} from "@/contexts/profile.context"
import {getColorFromStr} from "@/lib/helpers/colors"
import {getInitials, isDemo} from "@/lib/helpers/utils"
import {useSession} from "@/hooks/useSession"

type StyleProps = {
    themeMode: "system" | "dark" | "light"
    colorBgContainer: string
}

const {Sider} = Layout

const useStyles = createUseStyles({
    sidebar: ({colorBgContainer}: StyleProps) => ({
        background: `${colorBgContainer} !important`,
        height: "100vh",
        position: "sticky !important",
        bottom: "0px",
        top: "0px",

        "&>div:nth-of-type(2)": {
            background: `${colorBgContainer} !important`,
        },
    }),
    siderWrapper: ({themeMode}: StyleProps) => ({
        border: `0.01px solid ${themeMode === "dark" ? "#222" : "#ddd"}`,
    }),
    sliderContainer: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "0 10px",
        "& > div:nth-of-type(1)": {
            marginTop: "20px",
            marginBottom: "20px",
            marginRight: "20px",
            display: "flex",
            justifyContent: "center",
        },
        "& > div:nth-of-type(2)": {
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            flex: 1,
        },
    },
    menuContainer: {
        borderRight: "0 !important",
    },
    menuContainer2: {
        borderRight: "0 !important",
    },
    menuLinks: {
        width: "100%",
    },
    menuItemNoBg: {
        textOverflow: "unset !important",
        "& .ant-menu-submenu-title": {display: "flex", alignItems: "center"},
        "& .ant-select-selector": {
            padding: "0 !important",
        },
        "&> span": {
            display: "inline-block",
            marginTop: 4,
        },
        "& .ant-select-selection-item": {
            "&> span > span": {
                width: 120,
                marginRight: 10,
            },
        },
    },
    orgLabel: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        justifyContent: "flex-start",
        "&> div": {
            width: 18,
            height: 18,
            aspectRatio: "1/1",
            borderRadius: "50%",
        },
        "&> span": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
    },
})

const Sidebar: React.FC = () => {
    const {appTheme, toggleAppTheme} = useAppTheme()
    const {
        token: {colorBgContainer},
    } = theme.useToken()
    const router = useRouter()
    const appId = router.query.app_id as string
    const classes = useStyles({
        themeMode: appTheme,
        colorBgContainer,
    } as StyleProps)
    const {doesSessionExist, logout} = useSession()

    const pathSegments = router.asPath.split("/")
    const page_name = pathSegments[3]

    let initialSelectedKeys: string[] = []
    if (typeof page_name === "string") {
        initialSelectedKeys = [page_name]
    } else if (Array.isArray(page_name)) {
        initialSelectedKeys = page_name
    } else if (typeof page_name === "undefined") {
        initialSelectedKeys = ["apps"]
    }
    const [selectedKeys, setSelectedKeys] = useState(initialSelectedKeys)
    const {user, orgs, selectedOrg, changeSelectedOrg, reset} = useProfileData()
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        setSelectedKeys(initialSelectedKeys)
    }, [page_name])

    const getNavigationPath = (path: string) => {
        if (path === "apps") {
            return "/apps"
        } else {
            return `/apps/${appId}/${path}`
        }
    }

    const handleLogout = () => {
        AlertPopup({
            title: "Logout",
            message: "Are you sure you want to logout?",
            onOk: logout,
        })
    }

    let sidebarItems: MenuProps['items'] = [
        {
            label: (
                <Tooltip
                    key="apps"
                    placement="right"
                    title={
                        !collapsed
                            ? "Create new applications or switch between your existing projects."
                            : ""
                    }
                >
                    <Link
                        data-cy="app-management-link"
                        href={getNavigationPath("apps")}
                        className={classes.menuLinks}
                    >
                        {collapsed
                            ? "Create new applications or switch between your existing projects."
                            : "App Management"}
                    </Link>
                </Tooltip>
            ),
            icon: <AppstoreOutlined/>,
            key: "apps",
        },
    ]

    if (page_name) {
        sidebarItems = [
            {
                label: (
                    <>
                        <Tooltip
                            placement="right"
                            key="playground"
                            title={
                                !collapsed
                                    ? "Experiment with real data and optimize your parameters including prompts, methods, and configuration settings."
                                    : ""
                            }
                        >
                            <Link
                                data-cy="app-playground-link"
                                href={getNavigationPath("playground")}
                                className={classes.menuLinks}
                            >
                                {collapsed
                                    ? "Experiment with real data and optimize your parameters including prompts, methods, and configuration settings."
                                    : "Playground"}
                            </Link>
                        </Tooltip>
                    </>
                ),
                icon: <RocketOutlined/>,
                key: "playground"
            }, {
                label: (
                    <>
                        <Tooltip
                            placement="right"
                            title={
                                !collapsed
                                    ? "Create and manage testsets for evaluation purposes."
                                    : ""
                            }
                            key="testsets"
                        >
                            <Link
                                data-cy="app-testsets-link"
                                href={getNavigationPath("testsets")}
                                className={classes.menuLinks}
                            >
                                {collapsed
                                    ? "Create and manage testsets for evaluation purposes."
                                    : "Test Sets"}
                            </Link>
                        </Tooltip>
                    </>
                ),
                icon: <DatabaseOutlined/>,
                key: "testsets",
            }, {
                label: (
                    <>
                        <Tooltip
                            placement="right"
                            title={
                                !collapsed
                                    ? "Perform 1-to-1 variant comparisons on testsets to identify superior options."
                                    : ""
                            }
                            key="evaluations"
                        >
                            <Link
                                data-cy="app-evaluations-link"
                                href={getNavigationPath("evaluations")}
                                className={classes.menuLinks}
                            >
                                {collapsed
                                    ? "Perform 1-to-1 variant comparisons on testsets to identify superior options."
                                    : "Evaluate"}
                            </Link>
                        </Tooltip>
                    </>
                ),
                key: "evaluations",
                icon: <LineChartOutlined/>,
            }, {
                label: (
                    <>
                        <Tooltip
                            placement="right"
                            title={
                                !collapsed
                                    ? "Monitor production logs to ensure seamless operations."
                                    : ""
                            }
                            key="endpoints"
                        >
                            <Link
                                data-cy="app-endpoints-link"
                                href={getNavigationPath("endpoints")}
                                className={classes.menuLinks}
                            >
                                <Space>
                                                        <span>
                                                            {collapsed
                                                                ? "Monitor production logs to ensure seamless operations."
                                                                : "Endpoints"}
                                                        </span>
                                </Space>
                            </Link>
                        </Tooltip>
                    </>
                ),
                key: "endpoints",
                icon: <CloudUploadOutlined/>,
            },
            ...sidebarItems,
        ]
    }

    let helperItems: MenuProps['items'] = []
    if (doesSessionExist) {
        helperItems.push(
            {
                label: (
                    <>
                        <Link data-cy="settings-link" href="/settings">
                            Settings
                        </Link>
                    </>
                ),
                key: "settings",
                icon: <SettingOutlined/>
            }
        )
    }

    helperItems.push(
        {
            label: (
                <>
                    <Link href="https://docs.agenta.ai" target="_blank">
                        Help
                    </Link>
                </>
            ),
            key: "help",
            icon: <QuestionOutlined/>
        }
    )

    if (isDemo()) {
        helperItems.push(
            {
                label: (
                    <>
                        <Link
                            href="https://cal.com/mahmoud-mabrouk-ogzgey/demo"
                            target="_blank"
                        >
                            Talk to an Expert
                        </Link>
                    </>
                ),
                key: "expert",
                icon: <PhoneOutlined/>
            },
        )
        if (selectedOrg) {
            const children: MenuItemType[] = orgs.map((org, index) => (
                    {
                        label: (
                            <>
                                <span>{org.name}</span>
                            </>
                        ),
                        key: index as React.Key,
                        style: {
                            display: "flex",
                            alignItems: "center",
                        },
                        icon: (
                            <>
                                <Avatar
                                    size={"small"}
                                    style={{
                                        backgroundColor: getColorFromStr(org.id),
                                        color: "#fff",
                                    }}
                                >
                                    {getInitials(org.name)}
                                </Avatar>
                            </>
                        ),
                        onClick: () => changeSelectedOrg(org.id)
                    }
                )
            )

            helperItems.push(
                {
                    label: (
                        <div className={classes.menuItemNoBg}>
                            {selectedOrg.name}
                        </div>
                    ),
                    key: "workspaces",
                    children: children,
                    icon: <ApartmentOutlined/>,

                }
            )

            if (user?.username) {
                helperItems.push(
                    {
                        label: (
                            <>
                                Logout
                            </>
                        ),
                        key: "logout",
                        icon: <LogoutOutlined/>,
                        onClick: handleLogout
                    }
                )
            }
        }
    }


    return (
        <div className={classes.siderWrapper}>
            <Sider
                theme={appTheme}
                className={classes.sidebar}
                width={225}
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className={classes.sliderContainer}>
                    <div>
                        <Link data-cy="app-management-link" href={getNavigationPath("apps")}>
                            <Logo isOnlyIconLogo={collapsed}/>
                        </Link>
                    </div>
                    <ErrorBoundary fallback={<div/>}>
                        <div>
                            <Menu
                                mode="vertical"
                                selectedKeys={initialSelectedKeys}
                                className={classes.menuContainer}
                                items={sidebarItems}
                            />

                            <Menu
                                mode="vertical"
                                className={classes.menuContainer2}
                                selectedKeys={selectedKeys}
                                items={helperItems}
                            />
                        </div>
                    </ErrorBoundary>
                </div>
            </Sider>
        </div>
    )
}

export default Sidebar
