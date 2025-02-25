import com.github.gradle.node.npm.task.NpmTask
import com.github.gradle.node.task.NodeTask
import com.github.gradle.node.yarn.task.YarnTask
import com.github.gradle.node.npm.proxy.ProxySettings
import com.github.gradle.node.npm.task.NpxTask
import com.palantir.gradle.docker.DockerExtension
import groovy.json.JsonOutput
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.util.function.Function
import java.util.regex.Pattern


val dockerRepository: String by project
val repositoryPath: String by project
val buildType: String by project

val ihomeVersion = when(buildType) {
  "snapshot" -> "git tag --sort=-committerdate".runCommand() + "." + "git rev-parse --short HEAD".runCommand()
  else -> "git tag --sort=-committerdate".runCommand()
}

description = "I-Home UI"

plugins {
  idea
  java
  id ("com.github.node-gradle.node") version "7.1.0"
  id("com.palantir.docker") version "0.35.0"
}

node {
  // Whether to download and install a specific Node.js version or not
  // If false, it will use the globally installed Node.js
  // If true, it will download node using above parameters
  // Note that npm is bundled with Node.js

  download.set(false)

  // Version of node to download and install (only used if download is true)
  // It will be unpacked in the workDir
  version.set("18.20.6")

  // Version of npm to use
  // If specified, installs it in the npmWorkDir
  // If empty, the plugin will use the npm command bundled with Node.js
  npmVersion.set("")

  // Version of Yarn to use
  // Any Yarn task first installs Yarn in the yarnWorkDir
  // It uses the specified version if defined and the latest version otherwise (by default)
  yarnVersion.set("")

  // Base URL for fetching node distributions
  // Only used if download is true
  // Change it if you want to use a mirror
  // Or set to null if you want to add the repository on your own.
  distBaseUrl.set("https://nodejs.org/dist")

  // Specifies whether it is acceptable to communicate with the Node.js repository over an insecure HTTP connection.
  // Only used if download is true
  // Change it to true if you use a mirror that uses HTTP rather than HTTPS
  // Or set to null if you want to use Gradle's default behaviour.
//  allowInsecureProtocol.set(null)

  // The npm command executed by the npmInstall task
  // By default it is install but it can be changed to ci
  npmInstallCommand.set("install")

  // The directory where Node.js is unpacked (when download is true)
  workDir.set(file("${project.projectDir}/.cache/nodejs"))

  // The directory where npm is installed (when a specific version is defined)
  npmWorkDir.set(file("${project.projectDir}/.cache/npm"))

  // The directory where yarn is installed (when a Yarn task is used)
  yarnWorkDir.set(file("${project.projectDir}/.cache/yarn"))

  // The Node.js project directory location
  // This is where the package.json file and node_modules directory are located
  // By default it is at the root of the current project
  nodeProjectDir.set(file("${project.projectDir}"))

  // Whether the plugin automatically should add the proxy configuration to npm and yarn commands
  // according the proxy configuration defined for Gradle
  // Disable this option if you want to configure the proxy for npm or yarn on your own
  // (in the .npmrc file for instance)
//  nodeProxySettings.set(ProxySettings.SMART)
}

repositories {
  mavenCentral()
  maven { setUrl("https://repo.spring.io/release/") }
  maven { setUrl("https://plugins.gradle.org/m2/") }
}

tasks.npmInstall {
  nodeModulesOutputFilter {
    exclude("notExistingFile")
  }
}

tasks.yarn {
  nodeModulesOutputFilter {
    exclude("notExistingFile")
  }
}

//val testTaskUsingNpx = tasks.register<NpxTask>("testNpx") {
//  dependsOn(tasks.npmInstall)
//  command.set("mocha")
//  args.set(listOf("test", "--grep", "should say hello"))
//  ignoreExitValue.set(false)
//  environment.set(mapOf("MY_CUSTOM_VARIABLE" to "hello"))
//  workingDir.set(projectDir)
//  execOverrides {
//    standardOutput = System.out
//  }
//  inputs.dir("node_modules")
//  inputs.file("package.json")
//  inputs.dir("src")
//  inputs.dir("test")
//  outputs.upToDateWhen {
//    true
//  }
//}

val testTaskUsingNpm = tasks.register<NpmTask>("testNpm") {
  dependsOn(tasks.npmInstall)
  npmCommand.set(listOf("run", "test"))
  args.set(listOf("test"))
  ignoreExitValue.set(false)
  environment.set(mapOf("MY_CUSTOM_VARIABLE" to "hello"))
  workingDir.set(projectDir)
  execOverrides {
    standardOutput = System.out
  }
  inputs.dir("node_modules")
  inputs.file("package.json")
  inputs.dir("src")
  inputs.dir("test")
  outputs.upToDateWhen {
    true
  }
}

//val testTaskUsingYarn = tasks.register<YarnTask>("testYarn") {
//  dependsOn(tasks.npmInstall)
//  yarnCommand.set(listOf("run", "test"))
//  args.set(listOf("test"))
//  ignoreExitValue.set(false)
//  environment.set(mapOf("MY_CUSTOM_VARIABLE" to "hello"))
//  workingDir.set(projectDir)
//  execOverrides {
//    standardOutput = System.out
//  }
//  inputs.dir("node_modules")
//  inputs.file("package.json")
//  inputs.dir("src")
//  inputs.dir("test")
//  outputs.upToDateWhen {
//    true
//  }
//}

tasks.register<NodeTask>("run") {
  //dependsOn(testTaskUsingNpx, testTaskUsingNpm, testTaskUsingYarn)
  dependsOn(testTaskUsingNpm)
  script.set(file("src/main.js"))
//  args.set(listOf("Bobby"))
  ignoreExitValue.set(false)
//  environment.set(mapOf("MY_CUSTOM_VARIABLE" to "hello"))
  workingDir.set(projectDir)
  execOverrides {
    standardOutput = System.out
  }
  inputs.dir("src")
  outputs.upToDateWhen {
    false
  }
}

//val buildTaskUsingNpx = tasks.register<NpxTask>("buildNpx") {
//  dependsOn(tasks.npmInstall)
//  command.set("babel")
//  args.set(listOf("src", "--output-path", "${buildDir}/npx-output"))
//  inputs.dir("src")
//  outputs.dir("${buildDir}/npx-output")
//}

val buildTaskUsingNpm = tasks.register<NpmTask>("buildNpm") {
  dependsOn(tasks.npmInstall)
  npmCommand.set(listOf("run", "build"))
  //output hashing values are: "none", "all", "media", "bundles".
  args.set(listOf("--", "--output-hashing", "all", "--output-path", "${buildDir}/npm-output"))
  inputs.dir("src")
  outputs.dir("${buildDir}/npm-output")
}

//val buildTaskUsingYarn = tasks.register<YarnTask>("buildYarn") {
//  dependsOn(tasks.npmInstall)
//  yarnCommand.set(listOf("run", "build"))
//  args.set(listOf("--output-path", "${buildDir}/yarn-output"))
//  inputs.dir("src")
//  outputs.dir("${buildDir}/yarn-output")
//}

task("prepareNpm") {
//  file("${buildDir}/npx-output").mkdirs();
  file("${buildDir}/npm-output").mkdirs();
//  file("${buildDir}/yarn-output").mkdirs();
}

tasks.getByName("npmSetup").dependsOn("prepareNpm")

task("prepareFiles") {
  file("${project.buildDir}/docker/nginx").mkdir()
  doLast {
    logger.lifecycle("Creating jar. Version:  $ihomeVersion")
    copy {
      from("${project.buildDir}/npm-output/browser")
      into("${project.buildDir}/docker/static")
    }
    copy {
      println("Copying nginx.conf to ${project.projectDir}/nginx.conf")
      from("${project.projectDir}/nginx.conf")
      into("${project.buildDir}/docker/nginx")
      fileMode = 0b110100100
    }
  }
}

tasks.getByName("docker").dependsOn("prepareFiles")
tasks.getByName("prepareFiles").dependsOn("buildNpm")

tasks.named("dockerPush") {
  dependsOn("dockerTag")
}

fun execCommandWithOutput(input: String): String {
  return try {
    val parts = input.split("\\s".toRegex())
    val proc = ProcessBuilder(*parts.toTypedArray())
      .directory(rootDir)
      .redirectOutput(ProcessBuilder.Redirect.PIPE)
      .redirectError(ProcessBuilder.Redirect.PIPE)
      .start()
    proc.waitFor(20, TimeUnit.SECONDS)
    proc.inputStream.bufferedReader().readText().trim()
  } catch (e: IOException) {
    "<empty>"
  }
}

//sonarqube {
//  properties {
//    property("sonar.sources", "src")
//    property("sonar.typescript.node", node.variant.nodeExec)
//  }
//}

configure<DockerExtension> {
  val inputFile = File("version.json")
  val json = JsonOutput.toJson({ "version" to ihomeVersion })
  inputFile.writeText(JsonOutput.prettyPrint(json))
  name = "$dockerRepository/$repositoryPath/ui"
  tag("-${ihomeVersion}", "${dockerRepository}/${repositoryPath}/ui:${ihomeVersion}")
  tag("-latest", "${dockerRepository}/${repositoryPath}/ui:latest")
  setDockerfile(file("Dockerfile"))
}

idea {
  project {
    module {
      name = rootProject.name
      setDownloadJavadoc(true)
    }
  }
}

fun String.runCommand(currentWorkingDir: File = file("./")): String {
  val byteOut = ByteArrayOutputStream()
  project.exec {
    workingDir = currentWorkingDir
    commandLine = this@runCommand.split("\\s".toRegex())
    standardOutput = byteOut
  }
  return String(byteOut.toByteArray()).trim().split("\n").get(0)
}
