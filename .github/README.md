# Workflows

Crash course on workflows

    jobs:
      UN-NOME-BELLO:
        runs-on: ubuntu-latest

        steps:
          - name: checkout
            uses: actions/checkout@v4
          - name: verifica
            run: npm run basic_test
          - name: Detect package manager
            id: detect-package-manager
            run: |
              if [ -f "${{ github.workspace }}/yarn.lock" ]; then
                echo "manager=yarn" >> $GITHUB_OUTPUT
                echo "command=install" >> $GITHUB_OUTPUT
                exit 0
              elif [ -f "${{ github.workspace }}/frontend/package.json" ]; then
                echo "manager=npm" >> $GITHUB_OUTPUT
                echo "command=ci" >> $GITHUB_OUTPUT
                exit 0
              elif [ -f "${{ github.workspace }}/README.md" ]; then
                echo "there is md here"
                exit 0
              else
                echo "Unable to determine package manager"
                exit 1
              fi

If you write under a job:

    strategy:
      matrix:
        node-version: [20.x]
then you get back values with:

    ${{ matrix.node-version }}